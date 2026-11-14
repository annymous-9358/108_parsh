"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type Item = { href: string; label: string };

/** Header nav with the current section highlighted. */
export function NavLinks({ items }: { items: Item[] }) {
  const pathname = usePathname() ?? "";
  return (
    <>
      {items.map(({ href, label }) => {
        const active =
          pathname === href ||
          pathname.startsWith(href + "/") ||
          // a tirtha detail page belongs to the list section
          (href.endsWith("/tirthas") && pathname.startsWith(href.replace(/s$/, "") + "/"));
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={`nav-link transition-colors hover:text-maroon ${
              active ? "nav-link--active text-maroon" : ""
            }`}
          >
            {label}
          </Link>
        );
      })}
    </>
  );
}
