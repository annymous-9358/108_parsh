import raw from "@/content/entries.json";
import type { Tirtha, TirthaImage } from "@/lib/types";

type RawEntry = {
  entry_number: number;
  slug: string;
  title: string;
  city: string | null;
  state: string | null;
  mulnayak_text: string | null;
  tirth_text: string | null;
  history_text: string | null;
  other_temples_text: string | null;
  directions_text: string | null;
  shastra_text: string | null;
  raw_text: string;
  maps_url: string | null;
  phone: string | null;
  images: { xref: number; filename: string; width: number | null; height: number | null }[];
  cover_image_filename: string | null;
};

const entries = raw as RawEntry[];

export function localTirthas(): Tirtha[] {
  return entries.map(toTirtha);
}

export function localTirtha(slug: string): Tirtha | undefined {
  const e = entries.find((x) => x.slug === slug);
  return e ? toTirtha(e) : undefined;
}

export function localTirthaImages(slug: string): TirthaImage[] {
  const e = entries.find((x) => x.slug === slug);
  if (!e) return [];
  return e.images.map((im, i) => ({
    id: `${e.slug}-${im.xref}`,
    tirtha_id: e.slug,
    storage_path: im.filename,
    width: im.width,
    height: im.height,
    caption: null,
    sort_order: i,
  }));
}

function toTirtha(e: RawEntry): Tirtha {
  return {
    id: e.slug,
    entry_number: e.entry_number,
    slug: e.slug,
    title: e.title,
    city: e.city,
    state: e.state,
    mulnayak_text: e.mulnayak_text,
    tirth_text: e.tirth_text,
    history_text: e.history_text,
    other_temples_text: e.other_temples_text,
    directions_text: e.directions_text,
    shastra_text: e.shastra_text,
    trust_text: null,
    mantra_text: null,
    stuti_text: null,
    address_text: null,
    raw_text: e.raw_text,
    maps_url: e.maps_url,
    phone: e.phone,
    cover_image_path: e.cover_image_filename,
    published: true,
    sort_order: e.entry_number,
    latitude: null,
    longitude: null,
  };
}
