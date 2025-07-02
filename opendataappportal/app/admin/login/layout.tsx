import React, { ReactNode } from 'react';
import adminMenu from '@/app/data/admin_menu.json'
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar, NavGroup } from '@/components/app-sidebar';

interface AdminLayoutProps {
  children: ReactNode;
}

export default async function AdminLayout({ children }: AdminLayoutProps) {

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
