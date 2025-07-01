'use client';

import * as React from 'react';
import { SearchForm } from '@/components/search-form';
import { VersionSwitcher } from '@/components/version-switcher';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar';
import { LockClosedIcon } from '@radix-ui/react-icons';
import { Button } from './ui/button';
import { usePathname, useRouter } from 'next/navigation';

export interface NavGroup {
  title: string;
  items: Array<{ title: string; url: string; isActive: boolean }>;
}

export interface AppSidebarProps {
  navMain: NavGroup[];
}

export function AppSidebar(
  { navMain, ...props }: AppSidebarProps & React.ComponentProps<typeof Sidebar>
) {
  const pathname = usePathname();
  const router = useRouter();
  const isAdminPage = pathname === '/admin';

  const handleAdminClick = async () => {
    if (isAdminPage) {
      await fetch('/api/logout', { method: 'POST' });
      router.push('/dashboard');
    } else {
      router.push('/admin');
    }
  };

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <VersionSwitcher />
        <SearchForm />
      </SidebarHeader>

      <SidebarContent>
        {navMain.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={pathname === item.url}>
                      <a href={item.url}>{item.title}</a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}

        <Button
          variant="link"
          onClick={handleAdminClick}
          className="!mt-auto cursor-pointer p-2 m-2 rounded-md flex w-full justify-center items-center gap-2"
        >
          <LockClosedIcon />
          {isAdminPage ? 'Logout' : 'Admin'}
        </Button>
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  );
}
