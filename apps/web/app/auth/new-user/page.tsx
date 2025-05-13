"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useLogin, usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";

export default function Page() {
  const { login } = useLogin();
  const { ready, authenticated, user } = usePrivy();
  const router = useRouter();

  const [walletAdded, setWalletAdded] = useState(false);

  useEffect(() => {
    if (
      ready &&
      authenticated &&
      user?.id &&
      user?.wallet?.address &&
      !walletAdded
    ) {
      const addWallet = async () => {
        try {
          const res = await fetch("/api/user/wallet/add", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              privyId: user.id,
              walletAddress: user?.wallet?.address,
            }),
          });

          if (res.ok) {
            setWalletAdded(true);
            router.push("/earn");
          } else {
            console.error("Failed to add wallet");
          }
        } catch (error) {
          console.error("API error:", error);
        }
      };

      addWallet();
    }
  }, [ready, authenticated, user, walletAdded, router]);

  return (
    <div className="flex flex-col items-center w-full h-full justify-center min-h-screen bg-background px-4 sm:px-6 lg:px-8">
      <div className="bg-card p-6 sm:p-8 rounded-2xl shadow-lg text-center w-full max-w-md mx-auto border border-border">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4 text-foreground font-sora">Welcome to GITEARN</h1>
        <p className="mb-8 text-muted-foreground text-base sm:text-lg">Let&apos;s get your wallet set up</p>

        {ready && !authenticated && (
          <Button
            className="w-full h-12 text-base font-medium transition-all duration-200 cursor-pointer hover:invert-colors"
            onClick={() => login()}
          >
            Start now
          </Button>
        )}

        {authenticated && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">Creating your wallet...</p>
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-primary animate-pulse w-1/2"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}