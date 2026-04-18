"use client";

import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export type Screenshot = {
  src: string;
  alt: string;
};

export function ScreenshotCarousel({ screenshots }: { screenshots: Screenshot[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false, align: "start" });
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanPrev(emblaApi.canScrollPrev());
    setCanNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  if (!screenshots.length) return null;

  return (
    <section className="py-12 border-t border-border">
      <div className="container-page">
        <div className="flex items-end justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-[var(--font-display)] font-semibold">
            Screenshots
          </h2>
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Vorherige"
              disabled={!canPrev}
              onClick={() => emblaApi?.scrollPrev()}
              className={cn(
                "inline-flex h-10 w-10 items-center justify-center rounded-[var(--radius-md)]",
                "border border-border bg-card text-foreground cursor-pointer transition-colors",
                "hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed",
              )}
            >
              <ChevronLeft size={16} aria-hidden />
            </button>
            <button
              type="button"
              aria-label="Nächste"
              disabled={!canNext}
              onClick={() => emblaApi?.scrollNext()}
              className={cn(
                "inline-flex h-10 w-10 items-center justify-center rounded-[var(--radius-md)]",
                "border border-border bg-card text-foreground cursor-pointer transition-colors",
                "hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed",
              )}
            >
              <ChevronRight size={16} aria-hidden />
            </button>
          </div>
        </div>
        <div ref={emblaRef} className="overflow-hidden">
          <div className="flex gap-4">
            {screenshots.map((shot, i) => (
              <div
                key={i}
                className="relative flex-[0_0_80%] sm:flex-[0_0_45%] lg:flex-[0_0_32%] aspect-[9/16] rounded-[var(--radius-lg)] overflow-hidden border border-border bg-muted"
              >
                <Image
                  src={shot.src}
                  alt={shot.alt}
                  fill
                  sizes="(max-width: 640px) 80vw, (max-width: 1024px) 45vw, 32vw"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
