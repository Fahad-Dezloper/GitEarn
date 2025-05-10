'use client';

import { signIn } from "next-auth/react";
import { GithubIcon } from "@/components/ui/github";
import { Button } from "@/components/ui/button";
import type { ClientSafeProvider } from "next-auth/react";

interface SignInButtonsProps {
  providers: Record<string, ClientSafeProvider> | null;
}

export default function SignInButtons({ providers }: SignInButtonsProps) {
  console.log("signin buttons");
  // console.log("providers", providers);
  if (!providers) return <div>No providers found</div>;

  return (
    <>
      {Object.values(providers).map((provider) => (
        <Button
          key={provider.id}
          variant="outline"
          className="flex cursor-pointer text-lg items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          onClick={() => signIn(provider.id, { callbackUrl: '/earn' })}
        >
          {provider.id === 'github' && <GithubIcon className="bg-transparent" size={32} />}
          Sign in with {provider.name}
        </Button>
      ))}
    </>
  );
} 