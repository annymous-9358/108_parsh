import { createPublicClient } from "@/lib/supabase/public";
import { localTirthas, localTirtha, localTirthaImages } from "@/lib/local-content";
import { DEFAULT_LANGUAGE, type LanguageCode } from "@/lib/i18n/languages";
import type { Tirtha, TirthaImage, TirthaMapPoint, TirthaTranslation } from "@/lib/types";

const hasSupabase = !!process.env.NEXT_PUBLIC_SUPABASE_URL;

function applyTranslation(base: Tirtha, translation?: TirthaTranslation | null): Tirtha {
  if (!translation) return { ...base, is_translated: false };
  const hasContent = !!(translation.title || translation.raw_text);
  return {
    ...base,
    title: translation.title || base.title,
    city: translation.city || base.city,
    state: translation.state || base.state,
    raw_text: translation.raw_text || base.raw_text,
    is_translated: hasContent,
  };
}

export async function getAllTirthas(lang: LanguageCode = DEFAULT_LANGUAGE): Promise<Tirtha[]> {
  if (!hasSupabase) {
    return localTirthas()
      .filter((t) => t.published)
      .sort((a, b) => a.sort_order - b.sort_order);
  }
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("tirthas")
    .select("*")
    .eq("published", true)
    .order("sort_order", { ascending: true });
  if (error) throw error;
  const base = data as Tirtha[];

  if (lang === DEFAULT_LANGUAGE) return base;

  const { data: translations } = await supabase
    .from("tirtha_translations")
    .select("*")
    .eq("lang_code", lang);
  const byId = new Map((translations ?? []).map((t) => [t.tirtha_id, t as TirthaTranslation]));
  return base.map((t) => applyTranslation(t, byId.get(t.id)));
}

export async function getTirtha(
  slug: string,
  lang: LanguageCode = DEFAULT_LANGUAGE,
): Promise<Tirtha | undefined> {
  if (!hasSupabase) {
    return localTirtha(slug);
  }
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("tirthas")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  if (!data) return undefined;
  const base = data as Tirtha;

  if (lang === DEFAULT_LANGUAGE) return base;

  const { data: translation } = await supabase
    .from("tirtha_translations")
    .select("*")
    .eq("tirtha_id", base.id)
    .eq("lang_code", lang)
    .maybeSingle();
  return applyTranslation(base, translation as TirthaTranslation | null);
}

export async function getAllTirthaMapPoints(
  lang: LanguageCode = DEFAULT_LANGUAGE,
): Promise<TirthaMapPoint[]> {
  const MAP_COLS = "id, entry_number, slug, title, city, state, maps_url, latitude, longitude";
  if (!hasSupabase) {
    return localTirthas()
      .filter((t) => t.published && t.latitude != null && t.longitude != null)
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((t) => ({
        id: t.id,
        entry_number: t.entry_number,
        slug: t.slug,
        title: t.title,
        city: t.city,
        state: t.state,
        maps_url: t.maps_url,
        latitude: t.latitude,
        longitude: t.longitude,
      }));
  }
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("tirthas")
    .select(MAP_COLS)
    .eq("published", true)
    .not("latitude", "is", null)
    .not("longitude", "is", null)
    .order("sort_order", { ascending: true });
  if (error) throw error;
  const base = data as unknown as TirthaMapPoint[];

  if (lang === DEFAULT_LANGUAGE) return base;

  const { data: translations } = await supabase
    .from("tirtha_translations")
    .select("tirtha_id, title, city, state")
    .eq("lang_code", lang);
  const byId = new Map((translations ?? []).map((t) => [t.tirtha_id, t]));
  return base.map((t) => {
    const tr = byId.get(t.id);
    if (!tr) return t;
    return {
      ...t,
      title: tr.title || t.title,
      city: tr.city || t.city,
      state: tr.state || t.state,
    };
  });
}

export async function getTirthaImages(tirthaSlugOrId: string): Promise<TirthaImage[]> {
  if (!hasSupabase) {
    return localTirthaImages(tirthaSlugOrId);
  }
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("tirtha_images")
    .select("*")
    .eq("tirtha_id", tirthaSlugOrId)
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return data as TirthaImage[];
}
