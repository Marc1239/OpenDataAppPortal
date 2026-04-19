import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import type { AppDoc, HeroFeature as HeroFeatureData } from "@/lib/types";
import { appImageUrl } from "@/lib/payload";
import { DownloadButton } from "@/components/download-button";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = {
  hero: HeroFeatureData | null;
  fallbackApp?: AppDoc | null;
};

export function HeroFeature({ hero, fallbackApp }: Props) {
  const featured =
    hero?.featuredApp && typeof hero.featuredApp === "object"
      ? (hero.featuredApp as AppDoc)
      : fallbackApp ?? null;

  const kicker = hero?.kicker ?? "Empfohlene App der Woche";
  const headline =
    hero?.headline ??
    (featured ? featured.title : "Anwendungen auf Basis offener Daten");
  const body =
    hero?.body ??
    featured?.shortDescription ??
    "Suche, entdecke und nutze Apps, die öffentliche Daten in echten Mehrwert verwandeln.";

  const image = featured ? appImageUrl(featured, "hero") : null;
  const primaryCtaLabel = hero?.primaryCTA?.label ?? "App-Katalog durchsuchen";
  const primaryCtaHref = hero?.primaryCTA?.href ?? "/apps";

  return (
    <section className={cn("relative overflow-hidden border-b border-border")}>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-[color-mix(in_oklab,var(--primary),transparent_94%)] to-transparent"
      />
      <div className="container-page py-14 md:py-20 grid gap-12 md:grid-cols-[1.1fr_1fr] items-center">
        <div>
          <span className="inline-flex items-center gap-2 rounded-[var(--radius-pill)] border border-border bg-card px-3 py-1 text-xs font-medium uppercase tracking-wider text-primary">
            <Sparkles size={12} aria-hidden />
            {kicker}
          </span>
          <h1 className="mt-5 text-4xl md:text-5xl lg:text-6xl font-[var(--font-display)] font-bold text-balance">
            {headline}
          </h1>
          <p className="mt-5 text-lg text-muted-foreground max-w-xl">{body}</p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href={primaryCtaHref}>
              <Button size="lg" variant="primary" trailing={<ArrowRight size={16} aria-hidden />}>
                {primaryCtaLabel}
              </Button>
            </Link>
            {featured && (
              <Link href={`/apps/${featured.slug}`}>
                <Button size="lg" variant="outline">
                  {featured.title} ansehen
                </Button>
              </Link>
            )}
          </div>

          {featured && (
            <div className="mt-8 flex flex-wrap gap-2">
              {featured.links?.appleAppStore && (
                <DownloadButton kind="apple" href={featured.links.appleAppStore} compact />
              )}
              {featured.links?.googlePlay && (
                <DownloadButton kind="google" href={featured.links.googlePlay} compact />
              )}
              {featured.links?.website && (
                <DownloadButton kind="website" href={featured.links.website} compact />
              )}
            </div>
          )}
        </div>

        <div className="relative">
          {image ? (
            <div className="relative aspect-[5/4] md:aspect-[4/3] rounded-[var(--radius-xl)] overflow-hidden border border-border bg-muted shadow-2xl">
              <Image
                src={image}
                alt={featured?.title ?? "Vorschau"}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          ) : (
            <div className="relative aspect-[5/4] rounded-[var(--radius-xl)] border border-border bg-muted grid place-items-center text-muted-foreground">
              Kein Bild hinterlegt
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
