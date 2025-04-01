"use client"

import * as React from "react"
import {
  BookOpen,
  Bot,
  CheckCircle,
  Code,
  Frame,
  Home,
  Map,
  PieChart,
  Scroll,
  Settings2,
  SquareTerminal,
  Trophy,
  User,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
  SidebarLockButton,
} from "@/components/ui/sidebar"

// This is sample data.
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
          title: "My Bounties",
          url: "/earn/bounties/my",
        },
        {
          title: "Explore Bounties",
          url: "/earn/bounties/explore",
        },
        {
          title: "Create Bounty",
          url: "/earn/bounties/create",
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
      items: [
        {
          title: "Top Earners",
          url: "/earn/leaderboard/top",
        },
        {
          title: "Weekly Rankings",
          url: "/earn/leaderboard/weekly",
        },
      ],
    },
    {
      title: "Profile",
      url: "/earn/profile",
      icon: User,
      items: [
        {
          title: "User Info",
          url: "/profile/info",
        },
        {
          title: "Past Contributions",
          url: "/earn/profile/contributions",
        },
        {
          title: "Wallet & Security",
          url: "/earn/profile/wallet",
        },
      ],
    },
    {
      title: "GitHub Integration",
      url: "/earn/github",
      icon: Code,
      items: [
        {
          title: "Install Extension",
          url: "/earn/github/extension",
        },
        {
          title: "Manage Repos",
          url: "/earn/github/repos",
        },
      ],
    },
    {
      title: "Review Board",
      url: "/earn/reviews",
      icon: CheckCircle,
      items: [
        {
          title: "Pending Reviews",
          url: "/earn/reviews/pending",
        },
        {
          title: "Approved Solutions",
          url: "/earn/reviews/approved",
        },
      ],
    },
    {
      title: "Settings",
      url: "/earn/settings",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "/earn/settings/general",
        },
        {
          title: "Notifications",
          url: "/earn/settings/notifications",
        },
        {
          title: "Wallet & Payments",
          url: "/earn/settings/wallet",
        },
      ],
    },
],

  projects: [
    {
      name: "Git Analyzer",
      url: "#",
      icon: Frame,
    },
    {
      name: "Cool Platforms",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Frame className="size-5" />
          {/* <span className="font-semibold">GitEarn</span> */}
        </div>
        <div className="flex items-center gap-1">
          <SidebarLockButton />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
