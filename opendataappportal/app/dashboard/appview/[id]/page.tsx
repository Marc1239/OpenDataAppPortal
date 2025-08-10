'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  AlignLeft
} from 'lucide-react';
import { useParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Button } from '@/components/ui/button';
import appsDresdenData from '@/app/data/apps_dresden.json';
import { calcMetaQuality } from "@/utils/metadata-quality";
import { Textarea } from '@/components/ui/textarea';
import MetaDataQualityPieChart from '@/components/metaDataQualityPieChart';
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
}

// Internes Interface mit Slug
interface AppEntry {
  key: string;
  slug: string;
  data: AppData;
}

const AppDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const sectionRefs = useRef<Record<string, HTMLElement>>({});

  // IntersectionObserver für die Sidebar
  useEffect(() => {
    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };
    const observer = new IntersectionObserver(observerCallback, {
      root: null,
      rootMargin: '0px',
      threshold: 1,
    });
    Object.values(sectionRefs.current).forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const addSectionRef = (id: string, ref: HTMLElement | null) => {
    if (ref) sectionRefs.current[id] = ref;
  };

  // JSON → Array mit Slug umwandeln
  const apps = useMemo<AppEntry[]>(() => {
    return Object.entries(appsDresdenData).map(([key, data]) => {
      const slug = key
        .toLowerCase()
        .replace(/\s+/g, '-')      // Leerzeichen → Bindestrich
        .replace(/[^a-z0-9\-]/g, ''); // nur a–z, 0–9 und -

      const metaQuality = calcMetaQuality(data as Record<string, unknown>);
      return {
        key,
        slug,
        data: { ...(data as AppData), metaDataQuality: metaQuality }
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
    <section className="py-32">
      <div className="container max-w-7xl">
        <div className="relative grid-cols-3 gap-20 lg:grid">
          {/* Hauptinhalt */}
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
            />
          </div>

          
          {/* Sticky Navigation */}
          <div className="sticky top-8 hidden h-fit lg:block">
            <span className="flex items-center gap-2 text-sm">
              <AlignLeft className="h-4 w-4" />
              Auf dieser Seite
            </span>
            <nav className="mt-2 text-sm">
              <ul>
                {['section1','section2','section3'].map((sec) => (
                  <li key={sec}>
                    <a
                      href={`#${sec}`}
                      className={cn(
                        'block py-1 transition-colors duration-200',
                        activeSection === sec
                          ? 'text-primary font-medium'
                          : 'text-muted-foreground hover:text-primary'
                      )}
                    >
                      {{
                        section1: 'Barrierefreiheit',
                        section2: 'Stadt',
                        section3: 'Kategorie'
                      }[sec]}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AppDetailPage;
