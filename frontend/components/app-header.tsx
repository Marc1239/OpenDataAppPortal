import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, MapPin } from "lucide-react";
import type { AppDoc, Category } from "@/lib/types";
import { mediaUrl } from "@/lib/payload";
import { DownloadButton } from "@/components/download-button";
import { formatDate } from "@/lib/utils";

export function AppHeader({ app }: { app: AppDoc }) {
  const cover =
    mediaUrl(app.heroImage, "hero") ?? app.heroImageURL ?? null;
  const category =
    app.category && typeof app.category === "object"
      ? (app.category as Category)
      : null;
  const links = app.links ?? {};

  return (
    <section className="border-b border-border bg-card">
      <div className="container-page py-10 md:py-14 grid gap-8 md:grid-cols-[220px_1fr] md:items-start">
        <div className="relative aspect-square w-[160px] md:w-full rounded-[var(--radius-xl)] overflow-hidden border border-border bg-muted">
          {cover ? (
            <Image
              src={cover}
              alt={app.title}
              fill
              sizes="220px"
              className="object-cover"
              priority
            />
          ) : (
            <div className="h-full grid place-items-center text-muted-foreground text-sm">
              Kein Bild
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            {category && (
              <Link
                href={`/apps?category=${category.slug}`}
                className="font-semibold uppercase tracking-wider text-primary hover:underline"
              >
                {category.name}
              </Link>
            )}
            {category && app.city && <span aria-hidden>·</span>}
            {app.city && (
              <span className="inline-flex items-center gap-1">
                <MapPin size={12} aria-hidden /> {app.city}
              </span>
            )}
            {app.publishDate && (
              <>
                <span aria-hidden>·</span>
                <span>Seit {formatDate(app.publishDate) || app.publishDate}</span>
              </>
            )}
          </div>

          <h1 className="text-4xl md:text-5xl font-[var(--font-display)] font-bold text-balance">
            {app.title}
          </h1>

          <p className="text-lg text-muted-foreground max-w-3xl">
            {app.shortDescription}
          </p>

          {app.barrierFree && (
            <div className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--success)]">
              <CheckCircle2 size={16} aria-hidden />
              Barrierefreie App
            </div>
          )}

          <div className="mt-2 flex flex-wrap gap-3">
            {links.appleAppStore && (
              <DownloadButton kind="apple" href={links.appleAppStore} />
            )}
            {links.googlePlay && (
              <DownloadButton kind="google" href={links.googlePlay} />
            )}
            {links.website && (
              <DownloadButton kind="website" href={links.website} />
            )}
            {links.github && <DownloadButton kind="github" href={links.github} />}
          </div>
        </div>
      </div>
    </section>
  );
}
