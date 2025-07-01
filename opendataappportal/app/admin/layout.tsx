"use client";
import { AppSidebar } from "@/components/app-sidebar"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Fragment,ReactNode } from "react";
import adminMenu from "@/app/data/admin_menu.json"

interface DashboardLayoutProps {
    children: ReactNode
  }

export default function DashbaordLayout({children}: DashboardLayoutProps) {
    

  return (
    <SidebarProvider>
      <AppSidebar navMain={adminMenu.navAdmin}/>
      <SidebarInset>
        <main className="flex flex-1 flex-col gap-4 p-4">
            {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
