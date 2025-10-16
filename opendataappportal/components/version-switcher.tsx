"use client"

import * as React from "react"
import {
  DropdownMenu,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Image from "next/image"

export function VersionSwitcher() {

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
            <SidebarMenu className="flex flex-col gap-4 items-center justify-start p-2 h-16">
              <div className="relative h-48 w-48">
                <Image
                  alt="Dresden Logo"
                  src="https://www.dresden.de/konfiguration/ressourcen/logos/logo_header_wo_bg_min.svg"
                  fill
                  sizes="96px"
                />
              </div>
            </SidebarMenu>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
