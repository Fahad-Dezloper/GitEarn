import { getProviders } from "next-auth/react";
import { AuthTesti } from '@/app/(landingpageComponent)/AuthTesti';
import SignInButtons from "@/app/(landingpageComponent)/SignInButtons";

export default async function SignInPage() {
  const providers = await getProviders();
  console.log("provider here", providers );

  return (
    <div className='flex overflow-x-hidden mainGradAuth w-full h-full md:px-24'>
      <div className='max-w-[75%] h-full md:flex hidden'>
        <div className='w-full h-full border flex overflow-hidden'>
          <AuthTesti />
        </div>
      </div>

      <div className="md:w-[50%] w-full border-r !overflow-y-hidden h-full flex flex-col gap-6 items-center justify-center text-center px-4">
  <h1 className="font-sora text-6xl">Sign In</h1>
  <p className="text-gray-500 dark:text-gray-400 max-w-md">
    Access your dashboard and start earning by contributing to open source.
  </p>
    <SignInButtons providers={providers} />
  <div className="w-full border-t border-gray-300 dark:border-gray-700 my-4"></div>

  <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm">
    We only use your data to personalize your experience and connect your GitHub account to our bounty system.
    Read more in our <a href="/privacy" className="underline hover:text-gray-700 dark:hover:text-white">Privacy Policy</a> and 
    <a href="/terms" className="underline ml-1 hover:text-gray-700 dark:hover:text-white">Terms of Service</a>.
  </p>

  <p className="text-xs text-gray-400 mt-4">Your data is never sold. Ever.</p>
</div>

    </div>
  );
}