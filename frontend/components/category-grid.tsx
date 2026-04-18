import Link from "next/link";
import * as Icons from "lucide-react";
import type { Category } from "@/lib/types";
import { cn } from "@/lib/utils";

type IconComponent = React.ComponentType<{ size?: number; "aria-hidden"?: boolean }>;

function resolveIcon(name?: string | null): IconComponent {
  if (!name) return Icons.Grid as IconComponent;
  const cleaned = name
    .replace(/[-_ ]+/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((p) => p[0]!.toUpperCase() + p.slice(1).toLowerCase())
    .join("");
  const found = (Icons as unknown as Record<string, IconComponent>)[cleaned];
  return found ?? (Icons.Grid as IconComponent);
}

const palette = [
  "from-blue-500/10 to-blue-500/5 text-blue-600 dark:text-blue-400",
  "from-amber-500/10 to-amber-500/5 text-amber-600 dark:text-amber-400",
  "from-emerald-500/10 to-emerald-500/5 text-emerald-600 dark:text-emerald-400",
  "from-violet-500/10 to-violet-500/5 text-violet-600 dark:text-violet-400",
  "from-rose-500/10 to-rose-500/5 text-rose-600 dark:text-rose-400",
  "from-cyan-500/10 to-cyan-500/5 text-cyan-600 dark:text-cyan-400",
  "from-orange-500/10 to-orange-500/5 text-orange-600 dark:text-orange-400",
  "from-indigo-500/10 to-indigo-500/5 text-indigo-600 dark:text-indigo-400",
];

export function CategoryGrid({ categories }: { categories: Category[] }) {
  if (!categories.length) return null;
  return (
    <section className="py-12">
      <div className="container-page">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-[var(--font-display)] font-semibold">
              Nach Kategorie
            </h2>
            <p className="mt-1 text-muted-foreground text-sm">
              Finde die richtige App für dein Thema.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {categories.map((cat, i) => {
            const Icon = resolveIcon(cat.icon);
            const colorClass = palette[i % palette.length]!;
            return (
              <Link
                key={cat.id}
                href={`/apps?category=${cat.slug}`}
                className={cn(
                  "group relative overflow-hidden rounded-[var(--radius-lg)] border border-border bg-card elevate",
                  "p-5 flex flex-col gap-3 min-h-[120px]",
                )}
              >
                <div
                  aria-hidden
                  className={cn(
                    "absolute inset-0 -z-10 bg-gradient-to-br opacity-80 group-hover:opacity-100 transition-opacity",
                    colorClass.split(" ").slice(0, 2).join(" "),
                  )}
                />
                <span
                  className={cn(
                    "inline-flex h-10 w-10 items-center justify-center rounded-[var(--radius-md)] bg-background/70",
                    colorClass.split(" ").slice(2).join(" "),
                  )}
                >
                  <Icon size={18} aria-hidden />
                </span>
                <span className="font-[var(--font-display)] font-semibold text-base">
                  {cat.name}
                </span>
                {cat.description && (
                  <span className="text-xs text-muted-foreground line-clamp-2">
                    {cat.description}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
