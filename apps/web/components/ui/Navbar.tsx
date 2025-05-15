"use client";
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "@/app/(landingpageComponent)/resizable-navbar";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { ArrowRightIcon } from "./arrow-right";
 
export default function NavbarDemo() {
  const navItems = [
    { name: "Home", link: "/" },
    { name: "How It Works", link: "#howitworks" },
    { name: "Features", link: "#features" },
    { name: "Customers", link: "#customers" },
  ];
 
  const {data: session, status} = useSession();
  // console.log("session from navbar", session?.user);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
 
  return (
    <div className="relative w-full py-4">
      <Navbar>
        {/* Desktop Navigation */}
        <NavBody>
          <NavbarLogo />
          <NavItems items={navItems} />
          <div className="flex items-center gap-4">
          {status === "authenticated" ? <><NavbarButton href="/earn" variant="primary" className="flex items-center">Earn <ArrowRightIcon className="hover:bg-transparent !py-0" size={20} /></NavbarButton></> : <>
            <NavbarButton href="/auth/signin" variant="primary">Sign Up</NavbarButton>
            </>}
          </div>
        </NavBody>
 
        {/* Mobile Navigation */}
        <MobileNav>
          <MobileNavHeader>
            <NavbarLogo />
            <MobileNavToggle
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
          </MobileNavHeader>
 
          <MobileNavMenu
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
          >
            {navItems.map((item, idx) => (
              <a
                key={`mobile-link-${idx}`}
                href={item.link}
                onClick={() => setIsMobileMenuOpen(false)}
                className="relative text-neutral-600 dark:text-neutral-300"
              >
                <span className="block">{item.name}</span>
              </a>
            ))}
            <div className="flex w-full flex-col gap-4">
              {session?.user ? <>
                <NavbarButton
                onClick={() => setIsMobileMenuOpen(false)}
                href="/earn"
                variant="primary"
                className="w-full"
              >
                Earn
              </NavbarButton>
              </> : <>
              <NavbarButton
                onClick={() => setIsMobileMenuOpen(false)}
                variant="primary"
                href="/auth/signin"
                className="w-full"
              >
                Sign Up
              </NavbarButton>
              </>}
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>
    </div>
  );
}