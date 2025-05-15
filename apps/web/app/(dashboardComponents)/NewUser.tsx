/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useLogin, usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function NewUser({ email }: { email: string }) {
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
              email: email,
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
  }, [ready, authenticated, user, walletAdded, router, email]);

  return (
    <div className="flex flex-col items-center w-full h-full justify-center min-h-screen bg-background px-4 sm:px-6 lg:px-8">
  <div className="bg-card p-6 sm:p-8 rounded-2xl shadow-lg text-center w-full max-w-md mx-auto border border-border">
    <div className="flex flex-col gap-2 mb-4">
    <h1 className="text-2xl sm:text-3xl font-bold text-foreground font-sora">Welcome to</h1>
    <img src="/LOGO/GITEARN.svg" alt="GitEarn Logo" className="h-12" />
    </div>
    <p className="mb-2 text-muted-foreground text-base sm:text-lg">Let&apos;s get your wallet set up</p>
    
    <div className="mb-8 bg-yellow-100 border border-yellow-300 text-yellow-900 text-sm sm:text-base font-medium px-4 py-3 rounded-md">
      ⚠️ Please use the <span className="font-bold">same email</span> you used to authorize with GitHub OAuth.
    </div>

    {ready && !authenticated && (
      <Button
        className="w-full h-12 text-base font-medium transition-all duration-200 cursor-pointer hover:invert-colors"
        onClick={() => login()}
      >
        Start now
      </Button>
    )}

    {authenticated && (
      <motion.div 
        className="space-y-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.p 
          className="text-sm text-muted-foreground"
          initial={{ y: 10 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Creating your wallet...
        </motion.p>
        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-primary"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ 
              duration: 1.5, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
          />
        </div>
      </motion.div>
    )}
  </div>
    </div>
  );
}