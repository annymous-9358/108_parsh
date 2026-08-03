"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Volume2, Square } from "lucide-react";
import type { LanguageCode } from "@/lib/i18n/languages";
import { speechLocale } from "@/lib/i18n/speech-locale";
import { googleTtsLang } from "@/lib/i18n/tts-lang";

/**
 * Reads page content aloud. Two engines, picked per-language:
 *
 * 1. The browser's built-in speech synthesis when the OS/browser has a
 *    matching installed voice — free, instant, works offline.
 * 2. A server-proxied call to Google Translate's free TTS endpoint when it
 *    doesn't. A website can't install an OS voice on the visitor's device,
 *    and playing text through a mismatched voice (e.g. an English voice
 *    reading Tamil script) produces unintelligible noise rather than
 *    speech, so instead of doing that or just disabling the control, we
 *    fetch real audio in the requested language from the cloud endpoint
 *    that /api/tts proxies (same free service the translation pipeline
 *    already relies on). Only when neither engine can voice the language
 *    (no local voice AND no TTS coverage — very few languages) do we fall
 *    back to a disabled button with an explanation.
 *
 * Temple entries run several thousand characters, and Google's TTS
 * endpoint caps requests around ~200 characters, so both engines work off
 * the same sentence-chunked queue — either as chained SpeechSynthesisUtterance
 * calls or chained <audio> playback, advancing on each chunk's end event.
 *
 * For local synthesis specifically: Chrome has a long-standing bug where a
 * single long utterance silently stops after ~15 seconds (never fires
 * onend). Keeping chunks well under that (~150 chars, a few seconds of
 * speech each) sidesteps it. An earlier version of this file also called
 * pause()/resume() on a timer as a second safety net — don't reintroduce
 * that: on many engines pause()+resume() restarts the CURRENT utterance
 * from the beginning rather than continuing it, so once a short chunk
 * finishes before the timer's next tick, every tick after that just
 * replays the same chunk forever. That was reported as audio "getting
 * stuck in a loop," and chunk length alone is enough to avoid the 15s cutoff.
 *
 * Playback must also stop when this component unmounts or when `text`/
 * `lang` changes mid-speech (e.g. navigating to a different temple or
 * switching language while "Listen" is active) — speechSynthesis is a
 * page-global queue, not scoped to this component, so without an explicit
 * cancel the old-language audio keeps playing over the new page. That was
 * reported as audio "not [matching] the correct translation."
 */
function getVoicesAsync(): Promise<SpeechSynthesisVoice[]> {
  return new Promise((resolve) => {
    const synth = window.speechSynthesis;
    const existing = synth.getVoices();
    if (existing.length > 0) {
      resolve(existing);
      return;
    }
    let settled = false;
    const finish = (voices: SpeechSynthesisVoice[]) => {
      if (settled) return;
      settled = true;
      synth.onvoiceschanged = null;
      resolve(voices);
    };
    synth.onvoiceschanged = () => finish(synth.getVoices());
    setTimeout(() => finish(synth.getVoices()), 1000);
  });
}

function findVoice(voices: SpeechSynthesisVoice[], locale: string): SpeechSynthesisVoice | null {
  const base = locale.split("-")[0].toLowerCase();
  return (
    voices.find((v) => v.lang.toLowerCase() === locale.toLowerCase()) ??
    voices.find((v) => v.lang.toLowerCase().split(/[-_]/)[0] === base) ??
    null
  );
}

function splitIntoChunks(text: string, maxLen = 150): string[] {
  const sentences = text.split(/(?<=[।॥.!?])\s+/);
  const chunks: string[] = [];
  let cur = "";
  for (const s of sentences) {
    const candidate = cur ? `${cur} ${s}` : s;
    if (candidate.length <= maxLen || !cur) {
      cur = candidate;
    } else {
      chunks.push(cur);
      cur = s;
    }
  }
  if (cur) chunks.push(cur);
  return chunks;
}

type Engine = "checking" | "local" | "cloud" | "unavailable";

export function SpeakButton({
  text,
  lang,
  label,
  stopLabel,
  unavailableLabel,
}: {
  text: string;
  lang: LanguageCode;
  label: string;
  stopLabel: string;
  unavailableLabel?: string;
}) {
  const [speaking, setSpeaking] = useState(false);
  const [engine, setEngine] = useState<Engine>("checking");
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Stop any in-flight playback when this button's text/lang changes (e.g.
  // the visitor navigates to a different temple or switches language while
  // "Listen" is active) or when the component unmounts. speechSynthesis is
  // a page-global queue, not scoped to this component instance, so without
  // this the previous language's audio keeps playing over the new page.
  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) window.speechSynthesis.cancel();
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
        audioRef.current = null;
      }
    };
  }, [text, lang]);

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      // Synchronous set here (not deferred to an async callback) is
      // deliberate: this branch is a one-time browser-capability check with
      // no async step of its own, and it must run client-only (post-hydration)
      // to avoid a server/client render mismatch — it can't be computed as
      // lazy initial state since `window` isn't available during SSR.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setEngine(googleTtsLang(lang) ? "cloud" : "unavailable");
      return;
    }
    let cancelled = false;
    const locale = speechLocale(lang);
    getVoicesAsync().then((voices) => {
      if (cancelled) return;
      const match = findVoice(voices, locale);
      if (match) {
        voiceRef.current = match;
        setEngine("local");
      } else {
        setEngine(googleTtsLang(lang) ? "cloud" : "unavailable");
      }
    });
    return () => {
      cancelled = true;
    };
  }, [lang]);

  const speakLocal = useCallback(() => {
    const synth = window.speechSynthesis;
    synth.cancel();
    const locale = speechLocale(lang);
    const chunks = splitIntoChunks(text);

    const speakChunk = (index: number) => {
      if (index >= chunks.length) {
        setSpeaking(false);
        return;
      }
      const utterance = new SpeechSynthesisUtterance(chunks[index]);
      utterance.lang = locale;
      if (voiceRef.current) utterance.voice = voiceRef.current;
      utterance.rate = 1;
      utterance.pitch = 1;

      utterance.onstart = () => setSpeaking(true);
      utterance.onend = () => speakChunk(index + 1);
      utterance.onerror = () => setSpeaking(false);

      synth.speak(utterance);
    };

    speakChunk(0);
  }, [text, lang]);

  const speakCloud = useCallback(() => {
    const ttsLang = googleTtsLang(lang);
    if (!ttsLang) return;
    const chunks = splitIntoChunks(text);
    const audio = new Audio();
    audioRef.current = audio;

    const playChunk = (index: number) => {
      if (index >= chunks.length || audioRef.current !== audio) {
        setSpeaking(false);
        return;
      }
      audio.src = `/api/tts?text=${encodeURIComponent(chunks[index])}&lang=${encodeURIComponent(ttsLang)}`;
      audio.onended = () => playChunk(index + 1);
      audio.onerror = () => setSpeaking(false);
      audio.play().then(() => setSpeaking(true)).catch(() => setSpeaking(false));
    };

    playChunk(0);
  }, [text, lang]);

  const toggle = useCallback(() => {
    if (speaking) {
      if (engine === "local" && "speechSynthesis" in window) window.speechSynthesis.cancel();
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
        audioRef.current = null;
      }
      setSpeaking(false);
      return;
    }
    if (engine === "local") speakLocal();
    else if (engine === "cloud") speakCloud();
  }, [speaking, engine, speakLocal, speakCloud]);

  if (!text.trim()) return null;

  if (engine === "unavailable" && unavailableLabel) {
    return (
      <button
        type="button"
        disabled
        title={unavailableLabel}
        aria-disabled="true"
        className="inline-flex shrink-0 cursor-not-allowed items-center gap-1.5 rounded-sm border border-sandstone-deep px-3 py-1.5 font-ui text-xs text-ink-soft/50"
      >
        <Volume2 className="h-3.5 w-3.5" aria-hidden />
        {label}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={speaking}
      title={speaking ? stopLabel : label}
      className="inline-flex shrink-0 items-center gap-1.5 rounded-sm border border-sandstone-deep px-3 py-1.5 font-ui text-xs text-ink-soft hover:border-maroon hover:text-maroon transition-colors"
    >
      {speaking ? <Square className="h-3.5 w-3.5" aria-hidden /> : <Volume2 className="h-3.5 w-3.5" aria-hidden />}
      {speaking ? stopLabel : label}
    </button>
  );
}
