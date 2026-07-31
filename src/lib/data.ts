import { createPublicClient } from "@/lib/supabase/public";
import { localTirthas, localTirtha, localTirthaImages } from "@/lib/local-content";
import type { Tirtha, TirthaImage } from "@/lib/types";

const hasSupabase = !!process.env.NEXT_PUBLIC_SUPABASE_URL;

export async function getAllTirthas(): Promise<Tirtha[]> {
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
  return data as Tirtha[];
}

export async function getTirtha(slug: string): Promise<Tirtha | undefined> {
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
  return data ?? undefined;
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
