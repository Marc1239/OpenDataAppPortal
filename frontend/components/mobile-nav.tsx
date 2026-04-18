"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import type { NavItem } from "@/lib/types";
import { cn } from "@/lib/utils";

export function MobileNav({ nav }: { nav: NavItem[] }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        aria-label="Menü öffnen"
        aria-expanded={open}
        onClick={() => setOpen(true)}
        className={cn(
          "md:hidden inline-flex h-9 w-9 items-center justify-center rounded-[var(--radius-md)]",
          "border border-border bg-card text-foreground cursor-pointer",
          "transition-colors duration-200 hover:bg-muted",
        )}
      >
        <Menu size={16} aria-hidden />
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Navigation"
          className="fixed inset-0 z-50 md:hidden"
        >
          <button
            type="button"
            aria-label="Menü schließen"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-foreground/40 backdrop-blur-sm cursor-default"
          />
          <div className="absolute right-0 top-0 h-full w-[min(84vw,320px)] bg-background border-l border-border p-6 shadow-xl flex flex-col">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                Navigation
              </span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Menü schließen"
                className="inline-flex h-9 w-9 items-center justify-center rounded-[var(--radius-md)] border border-border bg-card text-foreground cursor-pointer hover:bg-muted transition-colors"
              >
                <X size={16} aria-hidden />
              </button>
            </div>
            <nav className="mt-6 flex flex-col gap-1">
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="px-3 py-3 rounded-[var(--radius-md)] text-base font-medium hover:bg-muted transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
