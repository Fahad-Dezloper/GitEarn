/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"
import { signIn, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import Mainbounties from "./(/bounties/etc)/mainbounties";
import Topbar from "./Topbar";
import { AlertCircle } from "lucide-react";

export function UpgradeGithubAccess() {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);

  // Type assertion for session scope
  // const hasRepoAccess = (session as any)?.scope?.includes("public_repo");
  const hasRepoAccess = true;

  const handleUpgradeAccess = async () => {
    setIsLoading(true);
    try {
      await signIn("github", { 
        callbackUrl: "/earn/bounties/add", 
        redirect: true,
        scope: "read:user user:email public_repo repo",
        prompt: "consent",
      });
    } catch (error) {
      console.error("Failed to upgrade access:", error);
      setIsLoading(false);
    }
  };
  
  if (hasRepoAccess) {
    return (
      <div className="">
        <Topbar />
        <Mainbounties />
      </div>
    );
  }
  
  return (
    <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
      <div className="flex items-start space-x-4">
        <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-full">
          <AlertCircle className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Enhance Your Experience</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            To fully utilize GitEarn&apos;s features, we need access to your public repositories. This allows you to:
          </p>
          <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 mb-6 space-y-2">
            <li>Create and manage bounties</li>
            <li>Track repository activity</li>
            <li>Interact with other developers</li>
          </ul>
          <Button
            onClick={handleUpgradeAccess}
            disabled={isLoading}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white transition-colors duration-200"
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Upgrading Access...
              </span>
            ) : (
              "Grant Repository Access"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}