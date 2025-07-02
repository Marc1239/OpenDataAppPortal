// app/admin/(protected)/layout.tsx
import React, { ReactNode } from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import adminMenu from '@/app/data/admin_menu.json';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar, NavGroup } from '@/components/app-sidebar';

export default async function AdminProtectedLayout({ children }: { children: ReactNode }) {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin-token')?.value;
  if (!token) {
    redirect('/admin/login');
  }

  const navMain: NavGroup[] = adminMenu.navAdmin;

  return (
    <SidebarProvider>
      <AppSidebar navMain={navMain} />
      <SidebarInset>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
