import { AlertCircle, Info, Loader2, Sparkles } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import AddBounty from './AddBounty'
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';

const LandingAddBounty = () => {
    const { data: session, status } = useSession();
    const [hasRepoAccess, setHasRepoAccess] = useState<boolean | null>(null);
    const [isLoading, setIsLoading] = useState(true);
  
    useEffect(() => {
      let isMounted = true;
  
      async function checkInstallation() {
        if (!session?.user?.email) return;
        
        try {
          const res = await fetch("/api/github/check-installation", { method: "GET" });
          if (!res.ok) throw new Error("Failed to check installation");
          const data = await res.json();
          if (isMounted) {
            setHasRepoAccess(data.installed);
            setIsLoading(false);
          }
        } catch (error) {
          console.error("Error checking GitHub app installation:", error);
          if (isMounted) {
            setHasRepoAccess(false);
            setIsLoading(false);
          }
        }
      }
  
      if (status === "authenticated") {
        checkInstallation();
      } else if (status === "unauthenticated") {
        setHasRepoAccess(false);
        setIsLoading(false);
      }
  
      return () => {
        isMounted = false;
      };
    }, [status]);
  
    if (status === "loading" || isLoading || hasRepoAccess === null) {
      return (
        <div className="min-h-[50vh] flex flex-col items-center justify-center p-6">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
          <p className="text-lg text-gray-600 dark:text-gray-300">Checking GitHub App installation...</p>
        </div>
      );
    }

    if (hasRepoAccess) {
        return (
          <>
            <AddBounty />
          </>
        );
      }

      const redirectAfterInstall = encodeURIComponent(window.location.origin + "/earn/bounties/add");
      const GITHUB_APP_INSTALL_URL = `https://github.com/apps/gitearn-hq/installations/new?state=${redirectAfterInstall}`;
    

  return (
    <div className='w-full h-full flex flex-col gap-6'>
                <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-3'>
                        <Sparkles className='w-5 h-5 text-[#007AFF] dark:text-[#00D1FF] ' />
                        <h2 className='text-xl font-semibold text-gray-900 dark:text-gray-50'>Latest Issues</h2>
                        <div className="group relative">
                            <Info className='w-4 h-4 text-gray-400 dark:text-gray-500 cursor-help' />
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 dark:bg-gray-800 text-white text-xs rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap">
                            Give your issue wings—add a bounty!
                                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 dark:bg-gray-800 rotate-45"></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md mx-auto bg-white dark:bg-[#171717] rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors">
  <div className="p-6 sm:p-8 space-y-6">
    <div className="flex justify-center">
      <div className="p-4 bg-red-100 dark:bg-red-900/30 rounded-full">
        <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
      </div>
    </div>
    <div className="text-center space-y-2">
      <h2 className="text-2xl flex flex-col items-center font-bold font-sora text-gray-900 dark:text-white">
        <span className="text-lg">Install</span>
         GitEarn GitHub App
      </h2>
      <p className="text-sm text-gray-600 dark:text-gray-400">
        To add bounties to your GitHub issues, install the GitEarn GitHub App on your account or organization.
      </p>
    </div>
    <div className="flex justify-center">
      <Button
        asChild
        className="w-full sm:w-auto hover:bg-primary/90 text-white transition-colors"
      >
        <a
          href={GITHUB_APP_INSTALL_URL}
          target="_blank"
          rel="noopener noreferrer"
          role="button"
          className="flex items-center dark:text-black justify-center gap-2 px-4 py-2"
        >
          Install GitEarn App
        </a>
      </Button>
    </div>
  </div>
</div>
    </div>
                </div>
  )
}

export default LandingAddBounty