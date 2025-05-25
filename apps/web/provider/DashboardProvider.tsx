/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { BountyContextProvder } from "@/app/context/BountyContextProvider";
import { UserDetailsProvider } from "@/app/context/UserDetailsProvider";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ReactNode } from "react";

interface ProvidersProps {
  children: ReactNode;
}

export function DashboardProvider({ children }: ProvidersProps) {
  return (
    <UserDetailsProvider>
        <BountyContextProvder>
          <SidebarProvider>
            {children}
            </SidebarProvider>
        </BountyContextProvder>
      </UserDetailsProvider>
  );
}
