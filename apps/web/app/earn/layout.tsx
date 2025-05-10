'use client'
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";
import Topbar from "../(dashboardComponents)/Topbar";
import { UserDetailsProvider } from "../context/UserDetailsProvider";
import { BountyContextProvder } from "../context/BountyContextProvider";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return <div className="flex">
    <UserDetailsProvider>
    <BountyContextProvder>
    <SessionProvider>
    <SidebarProvider>
    <AppSidebar />
          <div className="flex flex-col w-full overflow-x-hidden px-4 md:px-12">
          <Topbar />
          {children}  
          </div>
    </SidebarProvider>
    </SessionProvider>
    </BountyContextProvder>
    </UserDetailsProvider>
    </div>;
}
