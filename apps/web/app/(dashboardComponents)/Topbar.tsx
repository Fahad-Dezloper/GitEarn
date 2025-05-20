 
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

  const router = useRouter();
  const pathname = usePathname();
  const pathSegments = pathname.split("/").filter(Boolean); 

  const formatSegment = (segment: any) => {
    return segment
      .replace(/-/g, " ") 
      .replace(/\b\w/g, (char: any) => char.toUpperCase()); 
  };

  return (
    <header className="flex border-b pb-4 justify-between mt-4 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1 md:hidden flex" />
        <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
        <Breadcrumb>
  <BreadcrumbList>
    {pathSegments.map((segment, index) => {
      const href = "/" + pathSegments.slice(0, index + 1).join("/");
      const isLast = index === pathSegments.length - 1;

      // Skip "Home" breadcrumb if first segment is "earn"
      if (index === 0 && segment === "earn") {
        return (
          <BreadcrumbItem key={href}>
            <Link href="/earn" passHref legacyBehavior>
              <BreadcrumbLink>Earn</BreadcrumbLink>
            </Link>
          </BreadcrumbItem>
        );
      }

      return (
        <React.Fragment key={href}>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            {isLast ? (
              <BreadcrumbPage>{formatSegment(segment)}</BreadcrumbPage>
            ) : (
              <Link href={href} passHref legacyBehavior>
                <BreadcrumbLink>{formatSegment(segment)}</BreadcrumbLink>
              </Link>
            )}
          </BreadcrumbItem>
        </React.Fragment>
      );
    })}
  </BreadcrumbList>
</Breadcrumb>

      </div>
      <div className="flex items-center gap-4">
        <div className="hidden md:flex">
          <ModeToggle />
        </div>
        <WalletMoney />
        {/* work on notification system */}
        {/* <Notification /> */}
        {status === "authenticated" && <UserAvatarCircle session={session} />}
      </div>
    </header>
  );
};

export default Topbar;
