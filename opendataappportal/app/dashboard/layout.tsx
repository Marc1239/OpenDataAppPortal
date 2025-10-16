import { AppSidebar } from "@/components/app-sidebar"
import { Separator } from "@/components/ui/separator"
import type { Metadata } from "next";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { ReactNode } from "react";
import dashboardMenu from "@/app/data/dashboard_menu.json"
import dynamic from "next/dynamic"
const BugReporterDrawer = dynamic(() => import('@/components/BugReporterDrawer'), {
  ssr: true,           
  loading: () => null,  
})
const NavBreadcrumbs = dynamic(() => import('@/components/NavBreadcrumbs'), {
  ssr: true,
  loading: () => null,
})
export const metadata: Metadata = {
  title: "App-Übersicht",
  description: "Hier befindet sich die Übersichtsseite der Apps",
};


interface DashboardLayoutProps {
    children: ReactNode
  }

export default function DashbaordLayout({children}: DashboardLayoutProps) {

  return (
    <SidebarProvider>
      <AppSidebar navMain={dashboardMenu.navMain} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <NavBreadcrumbs />
        <div className="ml-auto cursor-pointer flex items-center justify-center w-12 h-12">
          <BugReporterDrawer />
        </div>
        </header>
        <main className="flex flex-col gap-4 p-4">
            {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
