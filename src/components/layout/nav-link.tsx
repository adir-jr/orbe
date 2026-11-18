"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

function isActive(pathname: string, href: string) {
  if (href === "/categorias") {
    return pathname.startsWith("/categorias") || pathname.startsWith("/servicos");
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function NavLink({ href, children }: { href: string; children: ReactNode }) {
  const pathname = usePathname();
  const active = isActive(pathname, href);
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "rounded-md px-3 py-2 text-[0.9375rem] font-semibold transition-colors",
        active ? "text-brand-700" : "text-ink-muted hover:text-ink",
      )}
    >
      {children}
    </Link>
  );
}
