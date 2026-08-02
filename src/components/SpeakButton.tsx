"use client";

import { useCallback, useState } from "react";
import { Volume2, Square } from "lucide-react";
import type { LanguageCode } from "@/lib/i18n/languages";
import { speechLocale } from "@/lib/i18n/speech-locale";

/**
 * Reads page content aloud using the browser's built-in speech synthesis —
 * no external API, no key, works offline. This is the accessibility "listen"
 * control for visually impaired or low-literacy visitors.
 *
 * Temple entries run several thousand characters. Chrome has a long-standing
 * bug where a single long SpeechSynthesisUtterance silently stops after
 * ~15 seconds (it never fires onend, so it just goes quiet mid-sentence).
 * We work around this two ways: split the text into sentence-sized chunks
 * queued as separate utterances (each one individually short), and kick
 * pause()/resume() every few seconds while speaking, which is the standard
 * workaround that keeps Chrome's internal timer from stalling.
 *
 * State is driven by onstart/onend/onerror rather than set synchronously
 * before playback actually begins. Earlier versions here tried to manually
 * force-pick a voice object via getVoices() — that's fragile (voices load
 * asynchronously and often aren't ready yet). Setting utterance.lang and
 * letting the browser/OS pick its own best voice is more reliable.
 */
function splitIntoChunks(text: string, maxLen = 200): string[] {
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

export function SpeakButton({
  text,
  lang,
  label,
  stopLabel,
}: {
  text: string;
  lang: LanguageCode;
  label: string;
  stopLabel: string;
}) {
  const [speaking, setSpeaking] = useState(false);

  const toggle = useCallback(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const synth = window.speechSynthesis;

    if (speaking) {
      synth.cancel();
      setSpeaking(false);
      return;
    }

    synth.cancel();
    const locale = speechLocale(lang);
    const chunks = splitIntoChunks(text);

    let keepAlive: ReturnType<typeof setInterval> | undefined;
    const clearKeepAlive = () => {
      if (keepAlive) clearInterval(keepAlive);
      keepAlive = undefined;
    };

    const speakChunk = (index: number) => {
      if (index >= chunks.length) {
        clearKeepAlive();
        setSpeaking(false);
        return;
      }
      const utterance = new SpeechSynthesisUtterance(chunks[index]);
      utterance.lang = locale;
      utterance.rate = 1;
      utterance.pitch = 1;

      utterance.onstart = () => {
        setSpeaking(true);
        if (!keepAlive) {
          keepAlive = setInterval(() => {
            if (synth.speaking && !synth.paused) {
              synth.pause();
              synth.resume();
            }
          }, 5000);
        }
      };
      utterance.onend = () => speakChunk(index + 1);
      utterance.onerror = () => {
        clearKeepAlive();
        setSpeaking(false);
      };

      synth.speak(utterance);
    };

    speakChunk(0);
  }, [text, lang, speaking]);

  if (!text.trim()) return null;

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
