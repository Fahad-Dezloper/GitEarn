/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import SignIn from "@/components/sign-in";
import { ModeToggle } from "@/components/Toggle";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import React from "react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import WalletMoney from "./WalletMoney";
import Notification from "./Notification";
import UserAvatarCircle from "./UserAvatarCircle";
import BreadcrumbsTop from "./(topbar)/breadcrumbsTop";
import { useSession } from "next-auth/react";

const Topbar = () => {
  const { data: session, status } = useSession();
  const user = session?.user;
  console.log("session here on toop bar", session, status);

  return (
    <header className="flex border-b pb-4 justify-between mt-4 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
      <BreadcrumbsTop />
      <div className="flex items-center gap-4">
      <div className="hidden md:flex">
      <ModeToggle />
      </div>
      <WalletMoney />
      <Notification />
      {status === "authenticated" && <UserAvatarCircle session={session} />}
      </div>
    </header>
  );
};

export default Topbar;
