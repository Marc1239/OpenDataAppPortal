"use client"

import * as React from "react"
import { Check, ChevronsUpDown, GalleryVerticalEnd } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function VersionSwitcher() {

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
            <SidebarMenu
              className="flex flex-row items-center p-2"
            >
              <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                <GalleryVerticalEnd className="size-4" />
              </div>
              <div className="flex flex-col gap-0.5 leading-none">
                <span className="font-medium">Open Data App Portal</span>
              </div>
            </SidebarMenu>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
