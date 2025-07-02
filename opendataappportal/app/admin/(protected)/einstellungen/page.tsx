'use client';

import React, { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface Settings {
  primary: string;
  secondary: string;
  logoUrl: string;
}

export default function AdminEinstellungenPage() {
  const [settings, setSettings] = useState<Settings>({
    primary: '#3b82f6',
    secondary: '#f472b6',
    logoUrl: '',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.ok ? res.json() : Promise.reject())
      .then((data: Settings) => setSettings(data))
      .catch(() => toast.error('Konnte Einstellungen nicht laden'))
      .finally(() => setLoading(false));
  }, []);

  const save = async () => {
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      if (!res.ok) throw new Error();
      toast.success('Einstellungen gespeichert');
    } catch {
      toast.error('Fehler beim Speichern');
    }
  };

  if (loading) return <p>Lade Einstellungen…</p>;

  return (
    <div className="max-w-md mx-auto p-6 space-y-4">
      <h1 className="text-2xl">Einstellungen</h1>

      <div className="flex flex-col gap-2">
        <Label>Primärfarbe</Label>
        <Input
          type="color"
          value={settings.primary}
          onChange={e => setSettings(prev => ({ ...prev, primary: e.target.value }))}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label>Sekundärfarbe</Label>
        <Input
          type="color"
          value={settings.secondary}
          onChange={e => setSettings(prev => ({ ...prev, secondary: e.target.value }))}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label>Logo URL</Label>
        <Input
          placeholder="https://..."
          value={settings.logoUrl}
          onChange={e => setSettings(prev => ({ ...prev, logoUrl: e.target.value }))}
        />
      </div>

      <Button onClick={save}>Speichern</Button>
    </div>
  );
}
