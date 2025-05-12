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
import Image from "next/image"

export function VersionSwitcher() {

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
            <SidebarMenu
              className="flex flex-col gap-4 items-center justify-start p-2 h-16"
            >
              <Image alt="Dresden Logo" fill src="https://www.dresden.de/konfiguration/ressourcen/logos/logo_header_wo_bg_min.svg"/>
            </SidebarMenu>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
