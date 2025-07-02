'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { LoginForm } from '@/components/loginForm';

export default function AdminLoginPage() {
  const router = useRouter();

  const handleSubmit = async ({ username, password }: { username: string; password: string }) => {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user: username, pass: password }),
    });
    if (!res.ok) {
      toast.error('Ungültige Anmeldedaten');
      return;
    }
    toast.success('Erfolgreich eingeloggt');
    router.push('/admin/apps');
  };

  return <LoginForm onSubmit={handleSubmit} error={null} />;
}
