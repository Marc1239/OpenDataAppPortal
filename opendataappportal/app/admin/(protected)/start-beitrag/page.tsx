'use client';

import React, { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Label } from '@/components/ui/label';

interface Feature {
  icon: string;
  title: string;
  description: string;
}

interface HeroConfig {
  heading: string;
  imageSrc: string;
  imageAlt: string;
  features: Feature[];
}

export default function AdminStartBeitragPage() {
  const [config, setConfig] = useState<HeroConfig>({
    heading: '',
    imageSrc: '',
    imageAlt: '',
    features: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/startbeitrag')
      .then(res => res.json())
      .then((data: HeroConfig) => setConfig(data))
      .catch(() => toast.error('Konnte Start-Beitrag nicht laden'))
      .finally(() => setLoading(false));
  }, []);

  const save = async () => {
    try {
      const res = await fetch('/api/startbeitrag', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });
      if (!res.ok) throw new Error();
      toast.success('Start-Beitrag gespeichert');
    } catch {
      toast.error('Fehler beim Speichern');
    }
  };

  if (loading) return <p>Lade…</p>;

  return (
    <div className="max-w-2xl mx-auto space-y-6 p-6">
      <h1 className="text-2xl font-semibold">Start-Beitrag bearbeiten</h1>
      <div className="flex flex-col gap-2">
        <Label>Heading</Label>
        <Input
          value={config.heading}
          onChange={e => setConfig(c => ({ ...c, heading: e.target.value }))}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label>Bild-URL</Label>
        <Input
          value={config.imageSrc}
          onChange={e => setConfig(c => ({ ...c, imageSrc: e.target.value }))}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label>Alt-Text</Label>
        <Input
          value={config.imageAlt}
          onChange={e => setConfig(c => ({ ...c, imageAlt: e.target.value }))}
        />
      </div>

      <h2 className="text-xl font-medium">Features</h2>
      {config.features.map((f, i) => (
        <div key={i} className="border p-4 rounded space-y-2">
          <div className="flex flex-col gap-2">
            <Label>Icon Data URL</Label>
            <Input
              value={f.icon}
              onChange={e => {
                const updated = [...config.features];
                updated[i].icon = e.target.value;
                setConfig(c => ({ ...c, features: updated }));
              }}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Title</Label>
            <Input
              value={f.title}
              onChange={e => {
                const updated = [...config.features];
                updated[i].title = e.target.value;
                setConfig(c => ({ ...c, features: updated }));
              }}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Description</Label>
            <Textarea
              value={f.description}
              onChange={e => {
                const updated = [...config.features];
                updated[i].description = e.target.value;
                setConfig(c => ({ ...c, features: updated }));
              }}
            />
          </div>
          <Button
            variant="destructive"
            onClick={() => {
              setConfig(c => ({
                ...c,
                features: c.features.filter((_, idx) => idx !== i),
              }));
            }}
          >
            Feature entfernen
          </Button>
        </div>
      ))}

      <Button
        variant="outline"
        onClick={() =>
          setConfig(c => ({
            ...c,
            features: [...c.features, { icon: "", title: "", description: "" }],
          }))
        }
      >
        Feature hinzufügen
      </Button>

      <div className="mt-6">
        <Button onClick={save}>Speichern</Button>
      </div>
    </div>
  );
}
