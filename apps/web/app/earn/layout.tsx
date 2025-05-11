import { AppSidebar } from "@/components/app-sidebar";
import { ReactNode } from "react";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default async function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex">
          <AppSidebar />
          <div className="flex flex-col w-full overflow-x-hidden px-4 md:px-12">
          {children}  
          </div>
    </div>
  );
}
