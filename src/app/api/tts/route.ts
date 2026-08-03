import { NextRequest, NextResponse } from "next/server";

/**
 * Proxies Google Translate's free (undocumented) TTS endpoint so the browser
 * can play real speech for languages that have no locally installed OS
 * voice — the same free endpoint the extraction pipeline's deep-translator
 * step already relies on for text translation. Requests to
 * translate.google.com must go through a server (no CORS headers there,
 * and it blocks non-browser-looking User-Agents), so this route does the
 * fetch server-side and streams the MP3 bytes back.
 *
 * The endpoint caps input around ~200 characters per call, so the client
 * is expected to send pre-chunked text (SpeakButton already chunks to
 * sentence-sized pieces for the local-speech path, reused here).
 *
 * Deliberately NOT cached (`Cache-Control: no-store`, `dynamic =
 * "force-dynamic"`): every chunk of a temple's audio hits this same
 * pathname with only its `text`/`lang` query params differing, and per
 * Next.js's own CDN-caching docs some CDNs key their cache on the
 * pathname alone and silently drop query parameters. With a cacheable
 * response, the CDN serves the FIRST chunk's cached audio back for every
 * later chunk's request — which sounds exactly like playback "getting
 * stuck" repeating the first couple of lines.
 */
export const dynamic = "force-dynamic";

const MAX_CHARS = 200;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const text = (searchParams.get("text") ?? "").slice(0, MAX_CHARS);
  const lang = searchParams.get("lang") ?? "";

  if (!text.trim() || !lang.trim()) {
    return NextResponse.json({ error: "text and lang are required" }, { status: 400 });
  }

  const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(
    text
  )}&tl=${encodeURIComponent(lang)}&client=tw-ob`;

  const upstream = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      Referer: "https://translate.google.com/",
    },
  });

  if (!upstream.ok || !upstream.body) {
    return NextResponse.json({ error: "tts upstream failed" }, { status: 502 });
  }

  return new NextResponse(upstream.body, {
    headers: {
      "Content-Type": "audio/mpeg",
      "Cache-Control": "no-store",
    },
  });
}
