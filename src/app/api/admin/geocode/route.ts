import { NextRequest, NextResponse } from "next/server";

/**
 * Resolves a temple's Google Maps link to an address and geocodes it via
 * OpenStreetMap's free Nominatim service (no API key) — the same approach
 * extraction/geocode_tirthas.py used to seed lat/lng for all 120 temples,
 * ported here so admins can re-geocode a single temple after fixing its
 * maps_url, without running a Python script.
 *
 * Nominatim rarely matches a full "business name, street, area, city"
 * string — business names aren't indexed and confuse its parser — so this
 * tries the full resolved address first, then progressively drops leading
 * (most specific) segments until only city/state/pincode remain, which
 * almost always resolves.
 */
export const dynamic = "force-dynamic";

async function resolveAddress(mapsUrl: string): Promise<string | null> {
  let finalUrl: string;
  try {
    const resp = await fetch(mapsUrl, {
      headers: { "User-Agent": "Mozilla/5.0" },
      redirect: "follow",
    });
    finalUrl = resp.url;
  } catch {
    return null;
  }
  const parsed = new URL(finalUrl);
  const q = parsed.searchParams.get("q");
  if (q) return q;
  const m = finalUrl.match(/\/maps\/place\/([^/]+)\//);
  if (m) return decodeURIComponent(m[1].replace(/\+/g, " "));
  return null;
}

async function geocodeOnce(address: string): Promise<{ lat: number; lon: number } | null> {
  const url = `https://nominatim.openstreetmap.org/search?${new URLSearchParams({
    q: address,
    format: "json",
    limit: "1",
  })}`;
  try {
    const resp = await fetch(url, {
      headers: { "User-Agent": "108ParshwanathTirthaDarshan/1.0 (admin geocode)" },
    });
    const data = (await resp.json()) as Array<{ lat: string; lon: string }>;
    if (!data.length) return null;
    return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) };
  } catch {
    return null;
  }
}

async function geocodeLadder(address: string): Promise<{ lat: number; lon: number } | null> {
  const parts = address.split(",").map((p) => p.trim()).filter(Boolean);
  for (let start = 0; start < parts.length; start++) {
    const candidate = parts.slice(start).join(", ");
    if (candidate.length < 3) continue;
    const coords = await geocodeOnce(candidate);
    if (coords) return coords;
    // Nominatim usage policy: max 1 request/second.
    await new Promise((r) => setTimeout(r, 1100));
  }
  return null;
}

export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => null)) as { mapsUrl?: string; city?: string; state?: string } | null;
  const mapsUrl = body?.mapsUrl?.trim();

  if (!mapsUrl) {
    return NextResponse.json({ error: "mapsUrl is required" }, { status: 400 });
  }

  const address = await resolveAddress(mapsUrl);
  let coords = address ? await geocodeLadder(address) : null;

  if (!coords) {
    const fallback = [body?.city, body?.state, "India"].filter(Boolean).join(", ");
    if (fallback) {
      await new Promise((r) => setTimeout(r, 1100));
      coords = await geocodeOnce(fallback);
    }
  }

  if (!coords) {
    return NextResponse.json({ error: "Could not determine coordinates for this link" }, { status: 422 });
  }

  return NextResponse.json(coords);
}
