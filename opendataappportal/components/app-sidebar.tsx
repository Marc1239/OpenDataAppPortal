import * as React from "react"

import { SearchForm } from "@/components/search-form"
import { VersionSwitcher } from "@/components/version-switcher"
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
} from "@/components/ui/sidebar"
import { LockClosedIcon } from "@radix-ui/react-icons"
import { Button } from "./ui/button"

const data = {
  navMain: [
    {
      title: "Menü",
      url: "#",
      items: [
        {
          title: "Apps",
          url: "/dashboard/appview",
          isActive: true,
        },
      ],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <VersionSwitcher />
        <SearchForm />
      </SidebarHeader>
      <SidebarContent>
        {data.navMain.map((item) => (
          <SidebarGroup key={item.title}>
            <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {item.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={item.isActive}>
                      <a href={item.url}>{item.title}</a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      <Button variant="link" onClick={() => window.location.href="/admin"} className="!mt-auto cursor-pointer p-2 m-2 rounded-md flex w-full flex-row justify-center gap-2 items-center">
        <LockClosedIcon />
        <p>Admin</p>
      </Button>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
