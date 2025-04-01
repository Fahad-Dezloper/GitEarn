"use client"

import { ChevronRight, type LucideIcon } from "lucide-react"
import { useState } from "react"
import { usePathname } from "next/navigation"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
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
    icon?: LucideIcon
    isActive?: boolean
    items?: {
      title: string
      url: string
    }[]
  }[]
}) {
  const pathname = usePathname();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const isItemSelected = (item: { url: string, items?: { url: string }[] }) => {
    if (item.url === pathname) return true;
    return item.items?.some(subItem => subItem.url === pathname) || false;
  };

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const selected = isItemSelected(item);
          return (
            <Collapsible
              key={item.title}
              asChild
              open={selected || hoveredItem === item.title}
              className="group/collapsible"
            >
              <SidebarMenuItem
                onMouseEnter={() => setHoveredItem(item.title)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton 
                    tooltip={item.title}
                    className="transition-colors duration-150 ease-in-out hover:bg-accent/50"
                  >
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                    {item.title === "Dashboard" ? <></> : (
                      <ChevronRight 
                        className="ml-auto transition-transform duration-200 ease-in-out group-data-[state=open]/collapsible:rotate-90" 
                      />
                    )}
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent 
                  className="overflow-hidden data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:slide-out-to-top-1 data-[state=open]:slide-in-from-top-1"
                  style={{
                    transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
                    animationDuration: '200ms',
                    animationTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                >
                  <SidebarMenuSub>
                    {item.items?.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton 
                          asChild
                          className={`transition-colors duration-150 ease-in-out ${
                            subItem.url === pathname ? 'bg-accent' : 'hover:bg-accent/50'
                          }`}
                        >
                          <a href={subItem.url}>
                            <span>{subItem.title}</span>
                          </a>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}
