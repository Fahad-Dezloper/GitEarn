/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */
"use client"

import type * as React from "react"
import {
  Home,
  LifeBuoy,
  PiggyBank,
  Scroll,
  Send,
  SquareTerminal,
  Trophy,
  User,
} from "lucide-react"

import { NavMain } from "./nav-main"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useSession } from "next-auth/react"
import AnnouncementFooter from "@/app/(dashboardComponents)/AnnouncementFooter"
import { usePrivy } from "@privy-io/react-auth"

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
      url: "/earn/bounties/explore",
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
    },
    // {
    //   title: "Leaderboard",
    //   url: "/earn/leaderboard",
    //   icon: Trophy,
    // },
    {
      title: "Claim",
      url: "/earn/claim",
      icon: PiggyBank
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
  const { user } = usePrivy();
  // console.log("user privy", user);
  // console.log(session?.user);
  return (
    <Sidebar variant="floating" className="md:!z-0" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
              <a href="#" className="w-full flex items-center pt-3 justify-center h-full overflow-hidden">
                <div className="scale-90">
                  <img src="/LOGO/GITEARN.svg" className="dark:flex hidden w-full h-full object-cover" alt="GITEARN LOGO" />
                  <img src="/LOGO/GITEARND.svg" className="flex dark:hidden w-full h-full object-cover" alt="GITEARN LOGO" />
                </div>
              </a>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        {/* {session?.user ? <NavUser user={session?.user} /> : <div></div>} */}
        <AnnouncementFooter />
        {/* <NavSecondary items={data.navSecondary} className="mt-auto" /> */}
        {/* <SupportSheet items={data.navSecondary} /> */}
      </SidebarFooter>
    </Sidebar>
  )
}
