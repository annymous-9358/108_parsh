import type { LucideIcon } from "lucide-react";

export function TirthaSection({
  icon: Icon,
  label,
  text,
}: {
  icon: LucideIcon;
  label: string;
  text: string | null | undefined;
}) {
  if (!text?.trim()) return null;
  const paragraphs = text
    .split("\n")
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <section className="relative rounded-sm border border-sandstone-deep bg-ivory/60 p-5 sm:p-6">
      <div className="mb-3 flex items-center gap-2.5">
        <span className="bead-badge h-8 w-8 shrink-0">
          <Icon className="h-4 w-4" aria-hidden />
        </span>
        <h2 className="font-display text-lg text-maroon">{label}</h2>
      </div>
      <div className="space-y-3 font-body text-[1.02rem] leading-[1.8] text-ink">
        {paragraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
    </section>
  );
}
