import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { AppDoc } from "@/lib/types";
import { AppCard } from "@/components/app-card";

type Props = {
  title: string;
  subtitle?: string;
  apps: AppDoc[];
  seeAllHref?: string;
};

export function SectionRail({ title, subtitle, apps, seeAllHref }: Props) {
  if (!apps.length) return null;
  return (
    <section className="py-12">
      <div className="container-page">
        <div className="flex items-end justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-[var(--font-display)] font-semibold">
              {title}
            </h2>
            {subtitle && (
              <p className="mt-1 text-muted-foreground text-sm md:text-base">
                {subtitle}
              </p>
            )}
          </div>
          {seeAllHref && (
            <Link
              href={seeAllHref}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline whitespace-nowrap"
            >
              Alle ansehen
              <ArrowRight size={14} aria-hidden />
            </Link>
          )}
        </div>
        <div
          className="flex gap-5 overflow-x-auto hide-scrollbar pb-2 -mx-4 px-4 snap-x snap-mandatory md:snap-none"
          role="list"
        >
          {apps.map((app, i) => (
            <div
              key={app.id}
              role="listitem"
              className="flex-shrink-0 w-[280px] sm:w-[320px] snap-start"
            >
              <AppCard app={app} priority={i < 3} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
