"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function SearchLauncher() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [, startTransition] = useTransition();
  const router = useRouter();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const query = q.trim();
    setOpen(false);
    startTransition(() => {
      router.push(query ? `/apps?q=${encodeURIComponent(query)}` : "/apps");
    });
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Suche öffnen"
        className={cn(
          "inline-flex h-9 items-center gap-2 rounded-[var(--radius-md)] border border-border bg-card",
          "px-3 text-sm text-muted-foreground cursor-pointer",
          "hover:bg-muted transition-colors duration-200",
        )}
      >
        <Search size={15} aria-hidden />
        <span className="hidden sm:inline">Apps suchen</span>
        <span className="hidden md:inline text-[11px] tabular-nums text-muted-foreground/70 border border-border rounded px-1 py-0.5">
          ⌘K
        </span>
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Apps suchen"
          className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]"
        >
          <button
            type="button"
            aria-label="Suche schließen"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-foreground/40 backdrop-blur-sm cursor-default"
          />
          <form
            onSubmit={submit}
            className={cn(
              "relative w-[min(92vw,560px)] rounded-[var(--radius-lg)] border border-border",
              "bg-card shadow-xl overflow-hidden",
            )}
          >
            <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
              <Search size={16} className="text-muted-foreground" aria-hidden />
              <input
                autoFocus
                type="text"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Nach Apps, Kategorien oder Tags suchen..."
                className="flex-1 bg-transparent outline-none text-base placeholder:text-muted-foreground"
                aria-label="Suchbegriff"
              />
              <button
                type="button"
                aria-label="Schließen"
                onClick={() => setOpen(false)}
                className="inline-flex h-8 w-8 items-center justify-center rounded-[var(--radius-md)] hover:bg-muted cursor-pointer"
              >
                <X size={14} aria-hidden />
              </button>
            </div>
            <div className="px-4 py-3 text-xs text-muted-foreground flex items-center justify-between">
              <span>Enter drücken, um alle Ergebnisse zu sehen</span>
              <span className="tabular-nums">Esc zum Schließen</span>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
