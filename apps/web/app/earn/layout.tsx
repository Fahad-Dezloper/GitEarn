import { AppSidebar } from "@/components/app-sidebar";
import { DashboardProvider } from "@/provider/DashboardProvider";
import { ReactNode } from "react";


interface DashboardLayoutProps {
  children: ReactNode;
}

export default async function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <DashboardProvider>
    <div className="flex w-full h-full overflow-x-hidden overflow-y-hidden">
          <AppSidebar />
          <div className="flex flex-col w-full overflow-hidden px-4 md:px-12">
          {children}  
          </div>
    </div>
    </DashboardProvider>
  );
}
