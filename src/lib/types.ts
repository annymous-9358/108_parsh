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
