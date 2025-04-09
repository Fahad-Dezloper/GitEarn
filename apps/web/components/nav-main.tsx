"use client"

import { useState } from "react"
import { ChevronRight, type LucideIcon } from "lucide-react"

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon: LucideIcon
    isActive?: boolean
    items?: {
      title: string
      url: string
    }[]
  }[]
}) {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem
            key={item.title}
            className="group"
            onMouseEnter={() => setHoveredItem(item.title)}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <SidebarMenuButton asChild tooltip={item.title} isActive={item.isActive}>
              <a href={item.url}>
                <item.icon />
                <span>{item.title}</span>
              </a>
            </SidebarMenuButton>
            {item.items?.length ? (
              <>
                <SidebarMenuAction
                  className={`transition-transform duration-200 ${hoveredItem === item.title ? "rotate-90" : ""}`}
                >
                  <ChevronRight />
                  <span className="sr-only">Toggle</span>
                </SidebarMenuAction>
                <div
                  className={`transition-all duration-200 overflow-hidden ${
                    hoveredItem === item.title || item.isActive ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <SidebarMenuSub>
                    {item.items?.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton asChild>
                          <a href={subItem.url}>
                            <span>{subItem.title}</span>
                          </a>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </div>
              </>
            ) : null}
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
