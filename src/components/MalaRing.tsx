"use client";

import Link from "next/link";
import { useCompleted } from "@/lib/progress";

type MalaRingProps = {
  total: number;
  current?: number;
  size?: number;
  /** Slugs in entry order (1-indexed by position) — when given (with lang), beads link to a tirtha. */
  slugs?: string[];
  lang?: string;
  /** Slugs in entry order used only to light up completed beads (no links). */
  progressSlugs?: string[];
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
  lang = "hi",
  progressSlugs,
  className = "",
}: MalaRingProps) {
  const { completed } = useCompleted();
  const orderSlugs = slugs ?? progressSlugs;
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
        const s = orderSlugs?.[n - 1];
        const isDone = !!s && completed.has(s);
        const baseR = size < 160 ? 3.4 : 3.6;
        const bead = (
          <circle
            cx={cx}
            cy={cy}
            r={isCurrent ? 7 : isDone ? baseR + 1.1 : baseR}
            fill={
              isCurrent
                ? "var(--color-maroon)"
                : isDone
                  ? "var(--color-saffron)"
                  : "var(--color-gold)"
            }
            stroke={isDone && !isCurrent ? "var(--color-gold-bright)" : "none"}
            strokeWidth={isDone ? 0.8 : 0}
            opacity={isCurrent || isDone ? 1 : 0.5}
            className="transition-all duration-500"
          />
        );
        const slug = slugs?.[n - 1];
        if (slug) {
          return (
            <Link
              key={n}
              href={`/${lang}/tirtha/${slug}`}
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
