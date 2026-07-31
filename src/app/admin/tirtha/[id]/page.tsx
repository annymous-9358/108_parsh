import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/supabase/admin-guard";
import { TirthaForm } from "@/components/admin/TirthaForm";
import type { Tirtha, TirthaImage } from "@/lib/types";

export default async function EditTirthaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { supabase } = await requireAdmin();

  const [{ data: tirtha }, { data: images }] = await Promise.all([
    supabase.from("tirthas").select("*").eq("id", id).maybeSingle(),
    supabase
      .from("tirtha_images")
      .select("*")
      .eq("tirtha_id", id)
      .order("sort_order", { ascending: true }),
  ]);

  if (!tirtha) notFound();

  return (
    <TirthaForm
      mode="edit"
      tirtha={tirtha as Tirtha}
      images={(images ?? []) as TirthaImage[]}
    />
  );
}
