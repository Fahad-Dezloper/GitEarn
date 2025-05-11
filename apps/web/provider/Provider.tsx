/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { ReactNode } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { BountyContextProvder } from "@/app/context/BountyContextProvider";
import { UserDetailsProvider } from "@/app/context/UserDetailsProvider";
import AppWalletProvider from "@/app/components/AppWalletProvider";
import { SessionProvider } from "next-auth/react";

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider>
      <AppWalletProvider>
      <UserDetailsProvider>
        <BountyContextProvder>
          <SidebarProvider>
            {children}
          </SidebarProvider>
        </BountyContextProvder>
      </UserDetailsProvider>
      </AppWalletProvider>
      </SessionProvider>
  );
}
