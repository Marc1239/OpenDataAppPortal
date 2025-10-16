'use client';

import React, { useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";

interface FeatureConfig {
  icon: string;
  title: string;
  description: string;
}

interface HeroConfig {
  badge: string;
  heading: string;
  imageSrc: string;
  imageAlt: string;
  features: FeatureConfig[];
}

export function Hero45() {
  const [config, setConfig] = useState<HeroConfig | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/startbeitrag")
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data: HeroConfig) => setConfig(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="py-32 flex justify-center items-center">
      <div className="container overflow-hidden">
        <div className="mb-20 flex flex-col items-center gap-6 text-center">
          <h1 className="text-4xl font-semibold max-w-3xl lg:text-5xl">
            {config?.heading}
          </h1>
        </div>
        <div className="relative mx-auto max-w-screen-lg">
          <Image
            width={1000}
            height={500}
            src={config?.imageSrc || "/notfound.jpg"}
            alt={config?.imageAlt || "Hero Bild"}
            priority
            fetchPriority="high"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 1200px"
            className="aspect-video max-h-[500px] w-full rounded-xl object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
          <div className="absolute -top-28 -right-28 -z-10 aspect-video h-72 w-96 [background-size:12px_12px] opacity-40 [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_20%,transparent_100%)] sm:bg-[radial-gradient(hsl(var(--muted-foreground))_1px,transparent_1px)]" />
          <div className="absolute -top-28 -left-28 -z-10 aspect-video h-72 w-96 [background-size:12px_12px] opacity-40 [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_20%,transparent_100%)] sm:bg-[radial-gradient(hsl(var(--muted-foreground))_1px,transparent_1px)]" />
        </div>
        <div className="mx-auto mt-10 flex max-w-screen-lg flex-col md:flex-row">
          {config?.features.map((feat, idx) => (
            <React.Fragment key={idx}>
              {idx > 0 && (
                <Separator
                  orientation="vertical"
                  className="mx-6 hidden h-auto w-[2px] bg-gradient-to-b from-muted via-transparent to-muted md:block"
                />
              )}
              <div className="flex grow basis-0 flex-col rounded-md bg-background p-4">
                <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-full bg-background drop-shadow-lg">
                  <Image
                    src={feat.icon}
                    alt={feat.title}
                    fetchPriority="high"
                    width={20}
                    height={20}
                    className="h-auto w-5"
                  />
                </div>
                <h2 className="mb-2 font-semibold">{feat.title}</h2>
                <p className="text-sm text-muted-foreground">
                  {feat.description}
                </p>
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}

