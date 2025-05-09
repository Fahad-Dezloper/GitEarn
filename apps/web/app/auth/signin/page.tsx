import { getProviders } from "next-auth/react";
import { AuthTesti } from '@/app/(landingpageComponent)/AuthTesti';
import SignInButtons from "@/app/(landingpageComponent)/SignInButtons";

export default async function SignInPage() {
  const providers = await getProviders();

  return (
    <div className='flex overflow-x-hidden w-full h-full'>
      <div className='max-w-[70%] h-full flex p-6'>
        <div className='w-full h-full flex overflow-hidden rounded-xl'>
          <AuthTesti />
        </div>
      </div>

      <div className='w-[50%] h-full flex flex-col gap-6 items-center justify-center'>
        <h1 className="font-sora text-6xl">Sign In</h1>
        <SignInButtons providers={providers} />
      </div>
    </div>
  );
}