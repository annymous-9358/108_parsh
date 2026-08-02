"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Star, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { tirthaImageUrl } from "@/lib/image-url";
import type { Tirtha, TirthaImage, TirthaTranslation } from "@/lib/types";
import { LANGUAGES, DEFAULT_LANGUAGE, type LanguageCode } from "@/lib/i18n/languages";

type Props =
  | { mode: "create" }
  | { mode: "edit"; tirtha: Tirtha; images: TirthaImage[] };

const HI_FIELD_LABELS: { key: keyof Tirtha; label: string; multiline?: boolean }[] = [
  { key: "title", label: "शीर्षक" },
  { key: "city", label: "शहर" },
  { key: "state", label: "राज्य" },
  { key: "maps_url", label: "Google Maps लिंक" },
  { key: "phone", label: "फोन" },
  { key: "raw_text", label: "पूर्ण विवरण (मूल पाठ)", multiline: true },
];

type TranslationFields = { title: string; city: string; state: string; raw_text: string };
const EMPTY_TRANSLATION: TranslationFields = { title: "", city: "", state: "", raw_text: "" };

export function TirthaForm(props: Props) {
  const router = useRouter();
  const supabase = createClient();
  const fileInput = useRef<HTMLInputElement>(null);

  const initial: Partial<Tirtha> =
    props.mode === "edit"
      ? props.tirtha
      : { entry_number: 0, slug: "", title: "", published: true };

  const [form, setForm] = useState<Partial<Tirtha>>(initial);
  const [images, setImages] = useState<TirthaImage[]>(
    props.mode === "edit" ? props.images : [],
  );
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [activeLang, setActiveLang] = useState<LanguageCode>(DEFAULT_LANGUAGE);
  const [translation, setTranslation] = useState<TranslationFields>(EMPTY_TRANSLATION);
  const [translationExists, setTranslationExists] = useState(false);
  const [loadingTranslation, setLoadingTranslation] = useState(false);

  useEffect(() => {
    if (props.mode !== "edit" || activeLang === DEFAULT_LANGUAGE) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- loading flag for the fetch this effect kicks off
    setLoadingTranslation(true);
    supabase
      .from("tirtha_translations")
      .select("*")
      .eq("tirtha_id", props.tirtha.id)
      .eq("lang_code", activeLang)
      .maybeSingle()
      .then(({ data }) => {
        const t = data as TirthaTranslation | null;
        setTranslation({
          title: t?.title ?? "",
          city: t?.city ?? "",
          state: t?.state ?? "",
          raw_text: t?.raw_text ?? "",
        });
        setTranslationExists(!!t);
        setLoadingTranslation(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeLang]);

  function set<K extends keyof Tirtha>(key: K, value: Tirtha[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function setTranslationField<K extends keyof TranslationFields>(key: K, value: string) {
    setTranslation((t) => ({ ...t, [key]: value }));
  }

  async function handleSave() {
    setSaving(true);
    setError(null);

    if (activeLang !== DEFAULT_LANGUAGE) {
      if (props.mode !== "edit") {
        setSaving(false);
        return;
      }
      const { error } = await supabase.from("tirtha_translations").upsert(
        {
          tirtha_id: props.tirtha.id,
          lang_code: activeLang,
          title: translation.title || null,
          city: translation.city || null,
          state: translation.state || null,
          raw_text: translation.raw_text || null,
        },
        { onConflict: "tirtha_id,lang_code" },
      );
      setSaving(false);
      if (error) return setError(error.message);
      setTranslationExists(true);
      router.refresh();
      return;
    }

    const payload = { ...form };
    delete (payload as { id?: string }).id;

    if (props.mode === "create") {
      const { data, error } = await supabase
        .from("tirthas")
        .insert(payload)
        .select()
        .single();
      setSaving(false);
      if (error) return setError(error.message);
      router.push(`/admin/tirtha/${data.id}`);
      router.refresh();
    } else {
      const { error } = await supabase
        .from("tirthas")
        .update(payload)
        .eq("id", props.tirtha.id);
      setSaving(false);
      if (error) return setError(error.message);
      router.refresh();
    }
  }

  async function handleDelete() {
    if (props.mode !== "edit") return;
    if (!confirm("क्या आप वाकई इस तीर्थ को हटाना चाहते हैं?")) return;
    await supabase.from("tirthas").delete().eq("id", props.tirtha.id);
    router.push("/admin");
  }

  async function handleUpload(files: FileList | null) {
    if (!files || files.length === 0 || props.mode !== "edit") return;
    setUploading(true);
    for (const file of Array.from(files)) {
      const path = `${props.tirtha.id}/${crypto.randomUUID()}-${file.name}`;
      const { error: upErr } = await supabase.storage
        .from("tirtha-images")
        .upload(path, file);
      if (upErr) {
        setError(upErr.message);
        continue;
      }
      const { data: inserted } = await supabase
        .from("tirtha_images")
        .insert({
          tirtha_id: props.tirtha.id,
          storage_path: path,
          sort_order: images.length,
        })
        .select()
        .single();
      if (inserted) setImages((prev) => [...prev, inserted as TirthaImage]);
    }
    setUploading(false);
    if (fileInput.current) fileInput.current.value = "";
  }

  async function handleDeleteImage(img: TirthaImage) {
    await supabase.storage.from("tirtha-images").remove([img.storage_path]);
    await supabase.from("tirtha_images").delete().eq("id", img.id);
    setImages((prev) => prev.filter((i) => i.id !== img.id));
  }

  async function handleMakeCover(img: TirthaImage) {
    if (props.mode !== "edit") return;
    await supabase
      .from("tirthas")
      .update({ cover_image_path: img.storage_path })
      .eq("id", props.tirtha.id);
    set("cover_image_path", img.storage_path);
  }

  return (
    <div className="mx-auto max-w-3xl px-5 py-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl text-maroon">
          {props.mode === "create" ? "नया तीर्थ जोड़ें" : "तीर्थ संपादित करें"}
        </h1>
        <label className="flex items-center gap-2 font-ui text-xs text-ink-soft">
          <input
            type="checkbox"
            checked={form.published ?? true}
            onChange={(e) => set("published", e.target.checked)}
          />
          प्रकाशित
        </label>
      </div>

      {props.mode === "edit" && (
        <div className="mb-6 flex flex-wrap gap-1.5 border-b border-sandstone-deep/60 pb-4">
          {LANGUAGES.map((l) => (
            <button
              key={l.code}
              onClick={() => setActiveLang(l.code)}
              className={`rounded-full px-3 py-1 font-ui text-xs transition-colors ${
                activeLang === l.code
                  ? "bg-maroon text-ivory"
                  : "bg-sandstone text-ink-soft hover:text-maroon"
              }`}
            >
              {l.native}
            </button>
          ))}
        </div>
      )}

      {error && (
        <p className="mb-4 rounded-sm border border-maroon bg-maroon/10 p-3 font-ui text-xs text-maroon">
          {error}
        </p>
      )}

      {props.mode === "create" && (
        <div className="mb-4 grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block font-ui text-xs text-ink-soft">क्रमांक</label>
            <input
              type="number"
              value={form.entry_number ?? 0}
              onChange={(e) => set("entry_number", Number(e.target.value))}
              className="w-full rounded-sm border border-sandstone-deep bg-ivory px-3 py-2 font-ui text-sm outline-none focus:border-maroon"
            />
          </div>
          <div>
            <label className="mb-1 block font-ui text-xs text-ink-soft">slug</label>
            <input
              value={form.slug ?? ""}
              onChange={(e) => set("slug", e.target.value)}
              placeholder="tirtha-140"
              className="w-full rounded-sm border border-sandstone-deep bg-ivory px-3 py-2 font-ui text-sm outline-none focus:border-maroon"
            />
          </div>
        </div>
      )}

      {props.mode === "edit" && (
        <div className="mb-8">
          <p className="mb-2 font-ui text-xs text-ink-soft">फोटो</p>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
            {images.map((im) => (
              <div key={im.id} className="group relative aspect-square overflow-hidden rounded-sm bg-sandstone-deep/30">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={tirthaImageUrl(im.storage_path)}
                  alt=""
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 flex items-start justify-between bg-black/0 p-1.5 opacity-0 transition-opacity group-hover:bg-black/30 group-hover:opacity-100">
                  <button
                    onClick={() => handleMakeCover(im)}
                    title="मुख्य फोटो बनाएं"
                    className="rounded-full bg-ivory/90 p-1.5 text-gold hover:text-maroon"
                  >
                    <Star className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteImage(im)}
                    title="हटाएं"
                    className="rounded-full bg-ivory/90 p-1.5 text-ink-soft hover:text-maroon"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3">
            <input
              ref={fileInput}
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => handleUpload(e.target.files)}
              className="font-ui text-xs text-ink-soft"
            />
            {uploading && (
              <Loader2 className="ml-2 inline h-4 w-4 animate-spin text-maroon" />
            )}
          </div>
        </div>
      )}

      {activeLang === DEFAULT_LANGUAGE ? (
        <div className="flex flex-col gap-4">
          {HI_FIELD_LABELS.map(({ key, label, multiline }) => (
            <div key={key}>
              <label className="mb-1 block font-ui text-xs text-ink-soft">{label}</label>
              {multiline ? (
                <textarea
                  rows={10}
                  value={(form[key] as string) ?? ""}
                  onChange={(e) => set(key, e.target.value as never)}
                  className="w-full rounded-sm border border-sandstone-deep bg-ivory px-3 py-2 font-body text-sm leading-relaxed outline-none focus:border-maroon"
                />
              ) : (
                <input
                  value={(form[key] as string) ?? ""}
                  onChange={(e) => set(key, e.target.value as never)}
                  className="w-full rounded-sm border border-sandstone-deep bg-ivory px-3 py-2 font-ui text-sm outline-none focus:border-maroon"
                />
              )}
            </div>
          ))}
        </div>
      ) : loadingTranslation ? (
        <p className="font-ui text-sm text-ink-soft">लोड हो रहा है…</p>
      ) : (
        <div className="flex flex-col gap-4">
          {!translationExists && (
            <p className="rounded-sm border border-gold/60 bg-sandstone px-4 py-2.5 font-ui text-xs text-ink-soft">
              इस भाषा में अभी अनुवाद नहीं है — नीचे भरकर सहेजें।
            </p>
          )}
          <div>
            <label className="mb-1 block font-ui text-xs text-ink-soft">शीर्षक</label>
            <input
              value={translation.title}
              onChange={(e) => setTranslationField("title", e.target.value)}
              className="w-full rounded-sm border border-sandstone-deep bg-ivory px-3 py-2 font-ui text-sm outline-none focus:border-maroon"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block font-ui text-xs text-ink-soft">शहर</label>
              <input
                value={translation.city}
                onChange={(e) => setTranslationField("city", e.target.value)}
                className="w-full rounded-sm border border-sandstone-deep bg-ivory px-3 py-2 font-ui text-sm outline-none focus:border-maroon"
              />
            </div>
            <div>
              <label className="mb-1 block font-ui text-xs text-ink-soft">राज्य</label>
              <input
                value={translation.state}
                onChange={(e) => setTranslationField("state", e.target.value)}
                className="w-full rounded-sm border border-sandstone-deep bg-ivory px-3 py-2 font-ui text-sm outline-none focus:border-maroon"
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block font-ui text-xs text-ink-soft">पूर्ण विवरण</label>
            <textarea
              rows={10}
              value={translation.raw_text}
              onChange={(e) => setTranslationField("raw_text", e.target.value)}
              className="w-full rounded-sm border border-sandstone-deep bg-ivory px-3 py-2 font-body text-sm leading-relaxed outline-none focus:border-maroon"
            />
          </div>
        </div>
      )}

      <div className="mt-8 flex items-center justify-between border-t border-sandstone-deep/60 pt-6">
        {props.mode === "edit" && activeLang === DEFAULT_LANGUAGE ? (
          <button
            onClick={handleDelete}
            className="font-ui text-xs text-ink-soft hover:text-maroon"
          >
            यह तीर्थ हटाएं
          </button>
        ) : (
          <span />
        )}
        <button
          onClick={handleSave}
          disabled={saving}
          className="rounded-sm bg-maroon px-6 py-2.5 font-ui text-sm font-medium text-ivory hover:bg-maroon-deep transition-colors disabled:opacity-50"
        >
          {saving ? "सहेजा जा रहा है…" : "सहेजें"}
        </button>
      </div>
    </div>
  );
}
