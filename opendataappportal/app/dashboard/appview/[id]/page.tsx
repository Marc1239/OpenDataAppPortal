'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  AlignLeft
} from 'lucide-react';
import { useParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import appsDresdenData from '@/app/data/apps_dresden.json';
import { calcMetaQuality } from "@/utils/metadata-quality";
import BentoGrid from '@/components/bento-grid';

interface AppData {
  title: string;
  city: string;
  category: string;
  barrierFree: boolean;
  description: string;
  image: string;
  metaDataQuality: string;
  tags: string[];
  websiteLink?: string;
  appStoreLinkApple?: string;
  appStoreLinkAndroid?: string;
  publishDate?: string;
  publishInformation?: string;
  latestRelease?: string;
  github?: string | boolean;
  reportBug?: string;
  supportMail?: string;
}

interface AppEntry {
  key: string;
  slug: string;
  data: AppData;
}

const AppDetailPage: React.FC = () => {
  
  const { id } = useParams<{ id: string }>();
  const sectionRefs = useRef<Record<string, HTMLElement>>({});

  const addSectionRef = (id: string, ref: HTMLElement | null) => {
    if (ref) sectionRefs.current[id] = ref;
  };

  // JSON -> Array mit Slug umwandeln
  const apps = useMemo<AppEntry[]>(() => {
    return Object.entries(appsDresdenData).map(([key, data]) => {
      const slug = key
        .toLowerCase()
        .replace(/\s+/g, '-')      
        .replace(/[^a-z0-9\-]/g, ''); 

      const metaQuality = calcMetaQuality(data as Record<string, unknown>);
      const d = data as any;

      return {
        key,
        slug,
        data: { 
          ...(data as AppData), 
          websiteLink: d.websiteLink ?? undefined,
          appStoreLinkApple: d.appStoreLinkApple ?? undefined,
          appStoreLinkAndroid: d.appStoreLinkAndroid ?? undefined,
          publishDate: d.publishDate ?? undefined,
          publishInformation: d.publishInformation ?? undefined,
          latestRelease: d.latestRelease ?? undefined,
          github: d.github ?? undefined,
          reportBug: d.reportBug ?? undefined,
          tags: Array.isArray(d.tags) ? d.tags : [],
          metaDataQuality: metaQuality, 
          supportMail: d.supportMail ?? undefined,
        }
      };
    });
  }, []);

  // Das aktuelle Objekt finden
  const entry = apps.find((app) => app.slug === id);

  if (!entry) {
    return <p className="p-8 text-center">App nicht gefunden.</p>;
  }

  const { data } = entry;

  const metaPercent = useMemo(
    () => parseInt(String(data.metaDataQuality).replace("%", ""), 10) || 0,
    [data.metaDataQuality]
  );

  return (
    <section className="py-12">
        <div className="relative grid-cols-3">
          <div className="lg:col-span-2">
            <Badge variant="outline">{data.category}</Badge>
            <h1 className="mt-3 text-3xl font-extrabold">{data.title}</h1>
            <p className="text-muted-foreground mt-2 text-lg">
              {data.description}
            </p>
            <img
              src={data.image}
              alt={data.title}
              className="my-8 aspect-video w-full rounded-md object-cover"
            />
            <BentoGrid
              metaPercent={metaPercent}
              tags={data.tags ?? []}
              barrierFree={data.barrierFree}
              city={data.city}
              websiteLink={data.websiteLink}
              githubLink={typeof data.github === "string" ? data.github : undefined}
              appStoreLinkApple={data.appStoreLinkApple}
              appStoreLinkAndroid={data.appStoreLinkAndroid}
              publishDate={data.publishDate}
              publishInformation={data.publishInformation}
              latestRelease={data.latestRelease}
              reportBugLink={data.reportBug}
              supportMail={data.supportMail}
            />
          </div>
        </div>
    </section>
  );
};

export default AppDetailPage;
