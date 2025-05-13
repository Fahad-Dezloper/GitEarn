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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg text-center max-w-md w-full">
        <h1 className="text-2xl font-bold mb-4">Welcome to DevStack</h1>
        <p className="mb-6 text-gray-600">Let’s get your wallet set up</p>

        {ready && !authenticated && (
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white w-full"
            onClick={() => login()}
          >
            Start now
          </Button>
        )}

        {authenticated && (
          <p className="text-sm text-gray-500 mt-4">Creating your wallet...</p>
        )}
      </div>
    </div>
  );
}