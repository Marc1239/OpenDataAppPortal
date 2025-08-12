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
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { useSelectedLayoutSegments } from 'next/navigation';
import { Fragment,ReactNode, useState } from "react";
import { BugIcon} from "lucide-react";
import dashboardMenu from "@/app/data/dashboard_menu.json"
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ComboboxBugCategory } from "@/components/comboboxBugCategory";

interface DashboardLayoutProps {
    children: ReactNode
  }

export default function DashbaordLayout({children}: DashboardLayoutProps) {

  const [selectedBugCategory, setSelectedBugCategory] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);

  const segments = useSelectedLayoutSegments();

  const segmentTitles: Record<string, string> ={
    dashboard: "Übersicht",
    appview: "Apps"
  }

  const getLabel = (seg: string) =>
    segmentTitles[seg] ?? seg.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase())

    

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
          <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem>
                <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />

                {segments.map((segment, idx) => {
                    
                    const isLast = idx === segments.length - 1
                    const path = '/dashboard/' + segments.slice(0, idx + 1).join('/')
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
        <div className="ml-auto cursor-pointer flex items-center justify-center w-12 h-12">
          <Drawer open={isOpen} onOpenChange={setIsOpen}>
            <DrawerTrigger className=""><BugIcon /></DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>Möchtest du einen Fehler melden?</DrawerTitle>
                  <ComboboxBugCategory 
                    value={selectedBugCategory}
                    onValueChange={setSelectedBugCategory}
                  />
                <Textarea className="min-h-36" />
              </DrawerHeader>
              <DrawerFooter className='flex flex-row flex-nowrap py-2'>
                <Button className='w-1/2' onClick={() => setIsOpen(false)}>Senden</Button>
                <Button 
                  variant={"outline"} 
                  className='w-1/2' 
                  onClick={() => {
                    setIsOpen(false)
                    setSelectedBugCategory("")
                  }}>
                    Abbrechen
                </Button>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </div>
        </header>
        <main className="flex flex-col gap-4 p-4">
            {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
