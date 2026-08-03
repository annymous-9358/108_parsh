export type Tirtha = {
  id: string;
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
  raw_text: string | null;
  maps_url: string | null;
  phone: string | null;
  cover_image_path: string | null;
  published: boolean;
  sort_order: number;
  latitude: number | null;
  longitude: number | null;
  /** True when raw_text/title reflect a real translation rather than the Hindi fallback. */
  is_translated?: boolean;
};

/** Lightweight projection for the all-temples map page — just enough to place a pin and link out. */
export type TirthaMapPoint = Pick<
  Tirtha,
  "id" | "entry_number" | "slug" | "title" | "city" | "state" | "maps_url" | "latitude" | "longitude"
>;

/**
 * Lightweight projection used for card grids/lists (browse page, home
 * featured section). Deliberately excludes raw_text and other long fields —
 * passing full Tirtha rows (with raw_text) as props to a "use client"
 * component serializes them into the page payload for every one of the 139
 * entries, which is exactly what blew past Netlify's per-page blob size
 * limit during deploy. Keep this type light.
 */
export type TirthaSummary = Pick<
  Tirtha,
  | "id"
  | "entry_number"
  | "slug"
  | "title"
  | "city"
  | "state"
  | "cover_image_path"
  | "published"
  | "sort_order"
>;

export function toTirthaSummary(t: Tirtha): TirthaSummary {
  return {
    id: t.id,
    entry_number: t.entry_number,
    slug: t.slug,
    title: t.title,
    city: t.city,
    state: t.state,
    cover_image_path: t.cover_image_path,
    published: t.published,
    sort_order: t.sort_order,
  };
}

export type TirthaTranslation = {
  id: string;
  tirtha_id: string;
  lang_code: string;
  title: string | null;
  city: string | null;
  state: string | null;
  raw_text: string | null;
};

export type TirthaImage = {
  id: string;
  tirtha_id: string;
  storage_path: string;
  width: number | null;
  height: number | null;
  caption: string | null;
  sort_order: number;
};

export type ReadingHistoryEntry = {
  id: string;
  user_id: string;
  tirtha_id: string;
  view_count: number;
  bookmarked: boolean;
  last_viewed_at: string;
};
