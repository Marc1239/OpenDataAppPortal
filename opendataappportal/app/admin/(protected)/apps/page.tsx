'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';

interface AppEntry {
  key: string;
  title: string;
  city: string;
  category: string;
  barrierFree: boolean;
  isLatest: boolean;           
  description: string;
  image: string;
}

export default function AdminAppsPage() {
  const [apps, setApps] = useState<AppEntry[]>([]);

  // Daten von API laden
  useEffect(() => {
    fetch('/api/apps')
      .then(res => res.json())
      .then(data => {
        const list: AppEntry[] = Object.entries(data).map(([key, val]: any) => ({
          key,
          title: val.title,
          city: val.city,
          category: val.category,
          barrierFree: val.barrierFree,
          isLatest: val.isLatest ?? false,
          description: val.description,
          image: val.image,
        }));
        setApps(list);
      });
  }, []);

  const updateApp = <K extends keyof AppEntry>(idx: number, field: K, value: AppEntry[K]) => {
    const updated = [...apps];
    updated[idx] = { ...updated[idx], [field]: value };
    setApps(updated);
  };

  const addApp = () => {
    setApps(prev => [
      ...prev,
      {
        key: `new-${Date.now()}`,
        title: '',
        city: '',
        category: '',
        barrierFree: false,
        isLatest: false,
        description: '',
        image: '',
      },
    ]);
  };

  const deleteApp = (idx: number) => {
    setApps(prev => prev.filter((_, i) => i !== idx));
    toast.success('App wurde gelöscht');
  };

  const save = async () => {
    if (apps.some(a => !a.title.trim() || !a.city.trim() || !a.category.trim())) {
      toast.warning('Bitte fülle alle Pflichtfelder aus.');
      return;
    }
    const payload: Record<string, Omit<AppEntry, 'key'>> = {};
    apps.forEach(a => {
      payload[a.title] = {
        title: a.title,
        city: a.city,
        category: a.category,
        barrierFree: a.barrierFree,
        isLatest: a.isLatest,
        description: a.description,
        image: a.image,
      };
    });
    try {
      const res = await fetch('/api/apps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error();
      toast.success('Änderungen gespeichert!');
    } catch {
      toast.error('Fehler beim Speichern.');
    }
  };

  return (
    <main className="p-8">
      <h1 className="text-2xl mb-6">Apps bearbeiten</h1>

      <Accordion type="multiple" className="space-y-4">
        {apps.map((app, idx) => (
          <AccordionItem key={app.key} value={app.key}>
            <AccordionTrigger>{app.title || 'Neue App'}</AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-1 gap-4">
                <div className="flex flex-col gap-2">
                  <Label>Name der App</Label>
                  <Input
                    value={app.title}
                    onChange={e => updateApp(idx, 'title', e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Stadt</Label>
                  <Input
                    value={app.city}
                    onChange={e => updateApp(idx, 'city', e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Kategorie</Label>
                  <Input
                    value={app.category}
                    onChange={e => updateApp(idx, 'category', e.target.value)}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={app.barrierFree}
                    onCheckedChange={val => updateApp(idx, 'barrierFree', val as boolean)}
                    id={`barrier-${app.key}`}
                  />
                  <Label htmlFor={`barrier-${app.key}`}>Barrierefrei</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={app.isLatest}
                    onCheckedChange={val =>
                      updateApp(idx, 'isLatest', val as boolean)
                    }
                    id={`latest-${app.key}`}
                  />
                  <Label htmlFor={`latest-${app.key}`}>
                    Als neuste Veröffentlichung markieren
                  </Label>
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Beschreibung</Label>
                  <Textarea
                    className="w-full border rounded p-2"
                    value={app.description}
                    onChange={e => updateApp(idx, 'description', e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Bild URL</Label>
                  <Input
                    value={app.image}
                    onChange={e => updateApp(idx, 'image', e.target.value)}
                  />
                </div>
              </div>
              <div className="flex justify-end mt-4">
                <Button variant="destructive" onClick={() => deleteApp(idx)}>
                  Löschen
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <div className="flex justify-center my-6">
        <Button variant="outline" onClick={addApp} className="items-center space-x-2">
          <Plus />
          <span>Neue App</span>
        </Button>
      </div>

      <div className="flex justify-end">
        <Button onClick={save}>Speichern</Button>
      </div>
    </main>
  );
}
