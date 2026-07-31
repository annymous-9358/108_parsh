"use client";

import Link from "next/link";

type MalaRingProps = {
  total: number;
  current?: number;
  size?: number;
  /** Slugs in entry order (1-indexed by position) — when given, beads link to `/tirtha/{slug}`. */
  slugs?: string[];
  className?: string;
};

/**
 * The mala: a ring of beads, one per tirtha, echoing the japmala devotees
 * count through while chanting each Tirthankara's name. Doubles as the
 * homepage's signature hero and, on detail pages, a jump-navigator.
 */
export function MalaRing({
  total,
  current,
  size = 440,
  slugs,
  className = "",
}: MalaRingProps) {
  const r = size / 2;
  const beadOrbit = r - 18;
  const beads = Array.from({ length: total }, (_, i) => i + 1);

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      className={className}
      style={{ width: "100%", maxWidth: size, height: "auto" }}
      role="img"
      aria-label={`माला — ${total} तीर्थ`}
    >
      <circle
        cx={r}
        cy={r}
        r={beadOrbit}
        fill="none"
        stroke="var(--color-sandstone-deep)"
        strokeWidth={1}
        strokeDasharray="1 7"
        strokeLinecap="round"
      />
      {beads.map((n) => {
        const angle = (n / total) * Math.PI * 2 - Math.PI / 2;
        const cx = r + beadOrbit * Math.cos(angle);
        const cy = r + beadOrbit * Math.sin(angle);
        const isCurrent = n === current;
        const bead = (
          <circle
            cx={cx}
            cy={cy}
            r={isCurrent ? 7 : 3.4}
            fill={isCurrent ? "var(--color-maroon)" : "var(--color-gold)"}
            opacity={isCurrent ? 1 : 0.55}
            className="transition-all duration-300"
          />
        );
        const slug = slugs?.[n - 1];
        if (slug) {
          return (
            <Link
              key={n}
              href={`/tirtha/${slug}`}
              prefetch={false}
              aria-label={`तीर्थ क्रमांक ${n}`}
              className="focus-visible:outline-none"
            >
              <g className="hover:opacity-100">{bead}</g>
            </Link>
          );
        }
        return <g key={n}>{bead}</g>;
      })}
    </svg>
  );
}
