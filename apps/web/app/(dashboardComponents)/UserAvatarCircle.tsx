/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LifeBuoy, LogOut, Send } from "lucide-react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { DropdownMenuContent, DropdownMenuGroup, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { DropdownMenu, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar";
import { SidebarMenu } from "@/components/ui/sidebar";
import { BadgeCheck, ChevronsUpDown, Wallet, Check } from "lucide-react";
import { signOut } from "next-auth/react";
import githubUsername from 'github-username';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { useConnection } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { toast } from "sonner";
import { ModeToggle } from "@/components/Toggle";
import { SupportSheet } from "../components/DetachedSheet/FeedbackSupport";

export default function UserAvatarCircle({session}: {session: any}){
  // console.log("here tooo on useravatar circle", session);
  const user = session?.user;

    const [githubName, setGithubName] = useState<string | undefined>(undefined);
    const { isMobile } = useSidebar();
    const { publicKey, connected, disconnect } = useWallet();
    const { connection } = useConnection();
    const [balance, setBalance] = useState<number>(0);
    const [isCopied, setIsCopied] = useState(false);

    useEffect(() => {
        async function fetchGithubUsername(email: string) {
            try {
                const username = await githubUsername(email) as string;
                setGithubName(username);
            } catch (error) {
                console.error('Error fetching GitHub username:', error);
                setGithubName(undefined);
            }
        }
        if (user?.email) {
            fetchGithubUsername(user.email);
        }
    }, [user?.email]);

    useEffect(() => {
        async function getBalance() {
            if (publicKey) {
                const bal = await connection.getBalance(publicKey);
                setBalance(bal / LAMPORTS_PER_SOL);
            }
        }
        getBalance();
    }, [publicKey, connection]);

    if(!user){
      toast("Event has been created.")
    }

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setIsCopied(true);
        toast.success("Address copied to clipboard!");
        setTimeout(() => setIsCopied(false), 2000);
    };

    const handleWalletAction = () => {
        if (connected) {
            disconnect();
        } else {
            const walletButton = document.querySelector('.wallet-adapter-button') as HTMLButtonElement;
            walletButton?.click();
        }
    };

    const navSecondary = [
      {
        title: "Support",
        url: "#",
        icon: LifeBuoy,
      },
      {
        title: "Feedback",
        url: "#",
        icon: Send,
      },
    ];

    return (
        <>
        
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="rounded-lg">
                <AvatarImage src={user.image || undefined} alt={user.name || 'User'} />
                <AvatarFallback className="rounded-lg">CN</AvatarFallback>
              </Avatar>
              <div className="md:grid flex-1 text-left hidden text-sm leading-tight">
                <span className="truncate font-semibold">{githubName || user.name}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 md:block hidden rounded-full ${connected ? 'bg-green-500' : 'bg-gray-400'}`} />
                <ChevronsUpDown className="ml-auto size-4 hidden md:flex" />
              </div>
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "bottom"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="rounded-lg">
                  <AvatarImage src={user.image} alt={user.name || 'User'} />
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{user.name}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <Link href="/earn/profile" className="cursor-pointer">
                <DropdownMenuItem className="cursor-pointer">
                  <BadgeCheck />
                  Account
                </DropdownMenuItem>
              </Link>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <div className="px-2 py-2">
              <div className="flex flex-col gap-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div 
                        className="text-sm font-mono bg-muted p-2 rounded cursor-pointer hover:bg-muted/80 flex items-center justify-between"
                        onClick={() => publicKey && copyToClipboard(publicKey.toString())}
                      >
                        <span>
                          {publicKey ? `${publicKey.toString().slice(0, 4)}...${publicKey.toString().slice(-4)}` : 'Not Connected'}
                        </span>
                        {isCopied && <Check className="h-4 w-4 text-green-500" />}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Click to copy address</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                {connected && (
                  <div className="text-sm font-medium">
                    Balance: {balance.toFixed(4)} SOL
                  </div>
                )}
                <Button 
                  variant="outline" 
                  className="w-full justify-start gap-2"
                  onClick={handleWalletAction}
                >
                  <Wallet className="h-4 w-4" />
                  {connected ? 'Disconnect Wallet' : 'Connect Wallet'}
                </Button>
              </div>
            </div>
            <DropdownMenuSeparator />
            <div className="flex flex-col gap-2">
              <span className="md:hidden">
             <ModeToggle />
            </span>
            <SupportSheet items={navSecondary} />
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer" onClick={() => signOut()}>
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
    <div className="hidden">
      <WalletMultiButton />
    </div>
        </>
    )
}