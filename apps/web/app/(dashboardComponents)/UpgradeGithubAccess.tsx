/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"
import { signIn, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import Mainbounties from "./(/bounties/etc)/mainbounties";
import Topbar from "./Topbar";

export function UpgradeGithubAccess() {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  console.log("session here", session);
  // console.log("session here", session);
  // const hasRepoAccess = session?.scope?.includes("public_repo");
  const hasRepoAccess = true;
  // const handleUpgradeAccess = async () => {
  //   setIsLoading(true);
  //   await signIn("github", { 
  //     callbackUrl: "/earn/bounties/add", 
  //     redirect: true,
  //     scope: "read:user user:email public_repo",
  //     prompt: "consent",
  //   });
  // };
  
  if (hasRepoAccess) {
    return (
      <div className="">
        <Topbar />
        {/* <p className="text-green-800">You've granted repository access. You can now use all features.</p> */}
        <Mainbounties />
      </div>
    );
  }
  
  return (
    <div className="p-4 bg-blue-50 rounded-md">
      <h3 className="font-medium text-blue-800">Enhance Your Experience</h3>
      <p className="mb-3 text-blue-700">
        Grant access to your public repositories to unlock additional features.
      </p>
      <Button
        disabled={isLoading}
        variant="outline"
      >
        {isLoading ? "Upgrading..." : "Grant Repository Access"}
      </Button>
    </div>
  );
}