export function BeadDivider({ label }: { label?: string }) {
  return (
    <div className="bead-divider my-8 font-ui text-xs uppercase tracking-[0.25em]" role="separator">
      <span className="bead-dot" aria-hidden />
      {label && <span className="shrink-0 px-1">{label}</span>}
      <span className="bead-dot" aria-hidden />
    </div>
  );
}
