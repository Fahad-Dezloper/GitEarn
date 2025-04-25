"use client"

import type * as React from "react"
import {
  CheckCircle,
  Code,
  Command,
  Frame,
  Home,
  LifeBuoy,
  Map,
  PieChart,
  Scroll,
  Send,
  Settings2,
  SquareTerminal,
  Trophy,
  User,
} from "lucide-react"

import { NavMain } from "./nav-main"
import { NavSecondary } from "./nav-secondary"
import { NavUser } from "./nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useSession } from "next-auth/react"

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/earn",
      icon: Home,
      isActive: true,
    },
    {
      title: "Bounties",
      url: "/earn/bounties",
      icon: SquareTerminal,
      items: [
        {
          title: "Explore Bounties",
          url: "/earn/bounties/explore",
        },
        {
          title: "Add Bounty",
          url: "/earn/bounties/add",
        },
      ],
    },
    {
      title: "Transactions",
      url: "/earn/transactions",
      icon: Scroll,
      items: [
        {
          title: "Payment History",
          url: "/earn/transactions/history",
        },
        {
          title: "Deposits & Withdrawals",
          url: "/earn/transactions/wallet",
        },
      ],
    },
    {
      title: "Leaderboard",
      url: "/earn/leaderboard",
      icon: Trophy,
    },
    {
      title: "Profile",
      url: "/earn/profile",
      icon: User
    }
  ],
  navSecondary: [
    {
      title: "Support",
      url: "#",
      icon: LifeBuoy,
    },
    {
      title: "Feedback",
      url: "#",
      icon: Send,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const {data: session} = useSession();
  // console.log(session?.user);
  return (
    <Sidebar variant="floating" className="" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">GitEarn</span>
                  <span className="truncate text-xs">Enterprise</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        {session?.user ? <NavUser user={session?.user} /> : <div></div>}
      </SidebarFooter>
    </Sidebar>
  )
}
