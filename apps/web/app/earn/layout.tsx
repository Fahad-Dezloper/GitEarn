'use client'
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";
import Topbar from "../(dashboardComponents)/Topbar";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return <div className="flex">
    <SessionProvider>
     <SidebarProvider>
    <AppSidebar />
    <div className="flex flex-col w-full overflow-x-hidden px-12">
    <Topbar />
    {children}
    </div>
    </SidebarProvider>
    </SessionProvider>
    </div>;
}
