const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;

/**
 * Resolves a stored image filename (e.g. "img_472.jpeg") to a servable URL.
 * Falls back to the locally bundled copy under /public/tirtha-images until
 * Supabase Storage is configured, so the UI is fully previewable either way.
 */
export function tirthaImageUrl(filename: string | null | undefined): string {
  if (!filename) return "/tirtha-images/placeholder.svg";
  if (filename.startsWith("http")) return filename;
  if (SUPABASE_URL) {
    return `${SUPABASE_URL}/storage/v1/object/public/tirtha-images/${filename}`;
  }
  return `/tirtha-images/${filename}`;
}
