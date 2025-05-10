import type * as React from "react"
import type { LucideIcon } from "lucide-react"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { SheetTriggerCard } from "@/app/components/app/SheetTriggerCard/SheetTriggerCard"
import { Sheet } from "@silk-hq/components";

export function NavSecondary({
  items,
  ...props
}: {
  items: {
    title: string
    url: string
    icon: LucideIcon
  }[]
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  console.log("items here",items);
  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent className="flex">
        <SidebarMenu className="flex flex-row justify-between">
          {items.map((item) => (
            <Sheet.Trigger key={item.title}>
            <SidebarMenuItem className="w-full">
              <SidebarMenuButton asChild size="sm">
                <a href={item.url}>
                  <item.icon />
                  <span>{item.title}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
            </Sheet.Trigger>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
