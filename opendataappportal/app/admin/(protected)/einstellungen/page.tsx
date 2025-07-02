// app/admin/einstellungen/page.tsx
'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

export default function AdminEinstellungen() {
  const [primaryColor, setPrimaryColor] = useState('#1f2937');
  const [secondaryColor, setSecondaryColor] = useState('#3b82f6');
  const [logoUrl, setLogoUrl] = useState('');

  const saveSettings = () => {
    // TODO: API-Call, um die Einstellungen zu speichern
    console.log({ primaryColor, secondaryColor, logoUrl });
    alert('Einstellungen gespeichert (Test)');
  };

  return (
    <div className="max-w-md mx-auto p-6 space-y-4">
      <h1 className="text-2xl">Einstellungen</h1>

      <div className="flex flex-col">
        <Label>Primärfarbe</Label>
        <Input
          type="color"
          value={primaryColor}
          onChange={e => setPrimaryColor(e.target.value)}
        />
      </div>

      <div className="flex flex-col">
        <Label>Sekundärfarbe</Label>
        <Input
          type="color"
          value={secondaryColor}
          onChange={e => setSecondaryColor(e.target.value)}
        />
      </div>

      <div className="flex flex-col">
        <Label>Logo-URL</Label>
        <Input
          placeholder="https://…"
          value={logoUrl}
          onChange={e => setLogoUrl(e.target.value)}
        />
      </div>

      <Button onClick={saveSettings}>Speichern</Button>
    </div>
  );
}
