"use client";
import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { useSelectedLayoutSegments } from 'next/navigation';
import { Fragment,ReactNode } from "react";

interface DashboardLayoutProps {
    children: ReactNode
  }

export default function DashbaordLayout({children}: DashboardLayoutProps) {

  const segments = useSelectedLayoutSegments();

  const segmentTitles: Record<string, string> ={
    dashboard: "Übersicht",
    appview: "Apps"
  }

  /*const formatLabel = (seg: string) =>
    seg
      .replace(/-/g, ' ')
      .replace(/\b\w/g, char => char.toUpperCase())*/

  const getLabel = (seg: string) =>
    segmentTitles[seg] ?? seg.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase())

    

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem>
                <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />

                {segments.map((segment, idx) => {
                    
                    const isLast = idx === segments.length - 1
                    const path = '/' + segments.slice(0, idx + 1).join('/')
                    const label = getLabel(segment)

                    return (
                        <Fragment key={path}>
                        <BreadcrumbItem>
                            {isLast ? (
                            <BreadcrumbPage>{label}</BreadcrumbPage>
                            ) : (
                            <BreadcrumbLink href={path}>{label}</BreadcrumbLink>
                            )}
                        </BreadcrumbItem>
                        {/* Separator nur zwischen den Items */}
                        {!isLast && <BreadcrumbSeparator />}
                        </Fragment>
                    )
                })}

                {/* Falls keine Segmente, zeigen wir nur "Home" als current page */}
                {segments.length === 0 && (
                <BreadcrumbItem>
                    
                </BreadcrumbItem>
                )}
            </BreadcrumbList>
        </Breadcrumb>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4">
            {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
