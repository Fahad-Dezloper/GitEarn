import { getProviders } from "next-auth/react";
import { AuthTesti } from '@/app/(landingpageComponent)/AuthTesti';
import SignInButtons from "@/app/(landingpageComponent)/SignInButtons";

export default async function SignInPage() {
  const providers = await getProviders();

  return (
    <div className='flex overflow-x-hidden mainGradAuth w-full h-full md:px-24'>
      <div className='max-w-[75%] h-full md:flex hidden'>
        <div className='w-full h-full border flex overflow-hidden'>
          <AuthTesti />
        </div>
      </div>

      <div className="md:w-[50%] w-full border-r !overflow-y-hidden h-full flex flex-col gap-6 items-center justify-center text-center px-4">
        <h1 className="font-sora text-6xl text-foreground">Sign In</h1>
        <p className="text-muted-foreground max-w-md">
          Access your dashboard and start earning by contributing to open source.
        </p>
        <SignInButtons providers={providers} />
        <div className="w-full border-t border-border my-4"></div>

        <p className="text-sm text-muted-foreground max-w-sm">
          We request access to your public repositories to help you seamlessly add bounties and track activity on your issues through GitEarn. This lets us personalize your experience and connect your GitHub account to our bounty system effectively.
        </p>

        <p className="text-xs text-muted-foreground/80 mt-4">
          We never access your data without your action, and we never sell it. If you have any concerns, feel free to reach out to us at <a href="mailto:support@gitearn.com" className="text-sky-400 hover:underline font-semibold font-sora">support@gitearn.com</a>.
        </p>
      </div>

    </div>
  );
}