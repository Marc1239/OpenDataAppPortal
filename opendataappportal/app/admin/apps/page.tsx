'use client';

import { useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { toast } from "sonner"
import {
  Form,
  FormControl,
  FormItem,
  FormLabel,
  FormField,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
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

interface AppEntry {
  key: string;
  title: string;
  city: string;
  category: string;
  barrierFree: boolean;
  description: string;
  image: string;
}

const loginSchema = z.object({
  username: z.string().min(1, 'Benutzername ist erforderlich'),
  password: z.string().min(1, 'Passwort ist erforderlich'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function AdminPage() {
  const [tokenChecked, setTokenChecked] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [apps, setApps] = useState<AppEntry[]>([]);
  const [error, setError] = useState<string | null>(null);

  // react-hook-form Setup für Login
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: '', password: '' },
  });

  // Beim Mount: prüfen, ob bereits eingeloggt + Daten laden
  useEffect(() => {
    fetch('/api/apps')
      .then(res => {
        if (res.ok) {
          setLoggedIn(true);
          return res.json();
        } else {
          setLoggedIn(false);
          return null;
        }
      })
      .then(data => {
        if (data) {
          const list: AppEntry[] = Object.entries(data).map(([key, val]: any) => ({
            key,
            title: val.title,
            city: val.city,
            category: val.category,
            barrierFree: val.barrierFree,
            description: val.description,
            image: val.image,
          }));
          setApps(list);
        }
        setTokenChecked(true);
      });
  }, []);

  // Login-Submit-Handler
  const onSubmit: SubmitHandler<LoginFormValues> = async ({ username, password }) => {
    setError(null);
    const loginRes = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user: username, pass: password }),
    });
    if (!loginRes.ok) {
      setError('Ungültige Anmeldedaten');
      return;
    }
    // Bei Erfolg: Apps neu laden
    const appsRes = await fetch('/api/apps');
    if (!appsRes.ok) {
      setError('Konnte Apps nicht laden');
      return;
    }
    const data = await appsRes.json();
    const list: AppEntry[] = Object.entries(data).map(([key, val]: any) => ({
      key,
      title: val.title,
      city: val.city,
      category: val.category,
      barrierFree: val.barrierFree,
      description: val.description,
      image: val.image,
    }));
    setApps(list);
    setLoggedIn(true);
  };

  // Einzelnes Feld updaten
  const updateApp = <K extends keyof AppEntry>(idx: number, field: K, value: AppEntry[K]) => {
    const updated = [...apps];
    updated[idx] = { ...updated[idx], [field]: value };
    setApps(updated);
  };

  // Neue App anlegen
  const addApp = () => {
    const newKey = `new-${Date.now()}`;
    setApps([
      ...apps,
      { key: newKey, title: '', city: '', category: '', barrierFree: false, description: '', image: '' },
    ]);
  };

  // App löschen
  const deleteApp = (idx: number) => {
    setApps(apps.filter((_, i) => i !== idx));
    toast.success("App wurde gelöscht");
  };

  // Alles speichern
  const save = async () => {
    // Pflichtfelder prüfen
    for (const app of apps) {
      if (!app.title.trim() || !app.city.trim() || !app.category.trim()) {
        toast.warning('Bitte fülle bei allen Apps Titel, Stadt und Kategorie aus.');
        return;
      }
    }
    // In das Server-Format bringen
    const payload: Record<string, Omit<AppEntry, 'key'>> = {};
    apps.forEach(app => {
      payload[app.title] = {
        title: app.title,
        city: app.city,
        category: app.category,
        barrierFree: app.barrierFree,
        description: app.description,
        image: app.image,
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

  if (!tokenChecked) {
    return <p>Prüfe Anmeldung…</p>;
  }

  if (!loggedIn) {
    return (
      <div className="max-w-md mx-auto mt-20">
        <h1 className="text-2xl mb-6">Admin Login</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Benutzername</FormLabel>
                  <FormControl>
                    <Input placeholder="Username" {...field} />
                  </FormControl>
                  <FormDescription>Gib deinen Admin-Benutzernamen ein.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Passwort</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Passwort" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {error && <p className="text-red-600">{error}</p>}
            <Button type="submit">Einloggen</Button>
          </form>
        </Form>
      </div>
    );
  }

  return (
    <main className="p-8">
      <h1 className="text-2xl mb-6">Apps bearbeiten</h1>

      <Accordion type="multiple" className="space-y-4">
        {apps.map((app, idx) => (
          <AccordionItem key={app.key} value={app.key}>
            <AccordionTrigger>{app.title || 'Neue App'}</AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-1 gap-4">
                {/* Title */}
                <div className='gap-2 flex flex-col'>
                  <Label>Name der App</Label>
                  <Input
                    value={app.title}
                    onChange={e => updateApp(idx, 'title', e.target.value)}
                    required
                    className={!app.title.trim() ? 'border-red-500' : ''}
                  />
                  {!app.title.trim() && (
                    <p className="text-red-600 text-sm">Name der App ist erforderlich</p>
                  )}
                </div>
                {/* City */}
                <div className='gap-2 flex flex-col'>
                  <Label>Stadt</Label>
                  <Input
                    value={app.city}
                    onChange={e => updateApp(idx, 'city', e.target.value)}
                    required
                    className={!app.city.trim() ? 'border-red-500' : ''}
                  />
                  {!app.city.trim() && (
                    <p className="text-red-600 text-sm">Stadt ist erforderlich</p>
                  )}
                </div>
                {/* Category */}
                <div className='gap-2 flex flex-col'>
                  <Label>Kategorie</Label>
                  <Input
                    value={app.category}
                    onChange={e => updateApp(idx, 'category', e.target.value)}
                    required
                    className={!app.category.trim() ? 'border-red-500' : ''}
                  />
                  {!app.category.trim() && (
                    <p className="text-red-600 text-sm">Kategorie ist erforderlich</p>
                  )}
                </div>
                {/* BarrierFree */}
                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={app.barrierFree}
                    onCheckedChange={val => updateApp(idx, 'barrierFree', val as boolean)}
                    id={`barrier-${app.key}`}
                  />
                  <Label htmlFor={`barrier-${app.key}`}>Barrierefrei</Label>
                </div>
                {/* Description */}
                <div className='gap-2 flex flex-col'>
                  <Label>Beschreibung</Label>
                  <Textarea
                    className="w-full border rounded p-2"
                    value={app.description}
                    onChange={e => updateApp(idx, 'description', e.target.value)}
                  />
                </div>
                {/* Image URL */}
                <div className='gap-2 flex flex-col'>
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
          <Plus className="h-4 w-4" />
          <span>Neue App</span>
        </Button>
      </div>

      <div className="flex justify-end">
        <Button onClick={save}>Speichern</Button>
      </div>
    </main>
  );
}
