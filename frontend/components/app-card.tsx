import Link from "next/link";
import Image from "next/image";
import { CheckCircle2, MapPin } from "lucide-react";
import type { AppDoc, Category } from "@/lib/types";
import { mediaUrl } from "@/lib/payload";
import { calculateQuality } from "@/lib/metadata-quality";
import { cn } from "@/lib/utils";

function coverFor(app: AppDoc): string | null {
  return (
    mediaUrl(app.heroImage, "card") ??
    (app.heroImageURL && app.heroImageURL.length > 0 ? app.heroImageURL : null)
  );
}

function categoryName(cat: AppDoc["category"]): string | null {
  if (!cat) return null;
  if (typeof cat === "string") return null;
  return (cat as Category).name;
}

export function AppCard({ app, priority = false }: { app: AppDoc; priority?: boolean }) {
  const cover = coverFor(app);
  const quality = calculateQuality(app);
  const catName = categoryName(app.category);

  return (
    <Link
      href={`/apps/${app.slug}`}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-[var(--radius-lg)]",
        "bg-card border border-border elevate",
      )}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        {cover ? (
          <Image
            src={cover}
            alt={app.title}
            fill
            priority={priority}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground text-sm">
            Kein Bild
          </div>
        )}
        {app.isFeatured && (
          <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-[var(--radius-pill)] bg-accent text-accent-foreground text-[11px] font-semibold px-2 py-1">
            Empfohlen
          </span>
        )}
      </div>

      <div className="flex-1 p-5 flex flex-col gap-3">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          {catName && (
            <span className="font-medium uppercase tracking-wider text-primary">
              {catName}
            </span>
          )}
          {app.city && (
            <span className="inline-flex items-center gap-1">
              <MapPin size={12} aria-hidden /> {app.city}
            </span>
          )}
        </div>

        <h3 className="font-[var(--font-display)] font-semibold text-lg leading-snug">
          {app.title}
        </h3>

        <p className="text-sm text-muted-foreground line-clamp-3 flex-1">
          {app.shortDescription}
        </p>

        <div className="flex items-center justify-between pt-2 mt-1 border-t border-border">
          <div className="flex items-center gap-1.5 text-xs">
            <span
              aria-hidden
              className={cn(
                "inline-block h-2 w-2 rounded-full",
                quality >= 80
                  ? "bg-[var(--success)]"
                  : quality >= 50
                    ? "bg-primary"
                    : "bg-accent",
              )}
            />
            <span className="tabular-nums font-medium">{quality}%</span>
            <span className="text-muted-foreground">Metadaten</span>
          </div>
          {app.barrierFree && (
            <span className="inline-flex items-center gap-1 text-xs text-[var(--success)] font-medium">
              <CheckCircle2 size={12} aria-hidden />
              Barrierefrei
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
