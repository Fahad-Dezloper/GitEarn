/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { ReactNode } from "react";
import AppWalletProvider from "@/app/components/AppWalletProvider";
import { SessionProvider } from "next-auth/react";

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider>
      <AppWalletProvider>
            {children}
      </AppWalletProvider>
      </SessionProvider>
  );
}
