import { BentoGrid } from "@/components/magicui/bento-grid";
import { BoxesIcon } from "@/components/ui/boxes";
import { Button } from "@/components/ui/button";
import { GithubIcon } from "@/components/ui/github";
import Link from "next/link";
import { AnimatedBeamMultipleOutputDemo } from "./(dashboardComponents)/AnimatedGihub";
import RightSideLanding from "./(landingpageComponent)/RightSideLanding";
import { CircleDot } from "lucide-react";

export default function Home() {

  return (
    <div className='flex flex-col gap-3 w-full min-h-screen overflow-x-hidden'>
      {/* navbar */}
      <header className="container py-4 flex h-16 items-center justify-between px-4 md:px-48 md:pt-8">
        <div className="flex items-center gap-2">
          <GithubIcon size={28} className="" />
          <span className="text-3xl font-bold font-sora">GitEarn</span>
        </div>
        <nav className="flex items-center gap-4">
          <Link href="#how" className="text-sm font-medium text-muted-foreground hover:text-foreground">
            How it works
          </Link>
          <Link href="#projects" className="text-sm font-medium text-muted-foreground hover:text-foreground">
            Projects
          </Link>
          <Link href="#faq" className="text-sm font-medium text-muted-foreground hover:text-foreground">
            FAQ
          </Link>
          <Button variant="outline" size="sm">
            Connect Wallet
          </Button>
        </nav>
      </header>

{/* landing */}
      <div className="w-full flex-1 flex h-full overflow-x-hidden px-18 py-4">
        <div className="w-full h-full flex items-center mainGrad p-6 rounded-t-2xl ">
          
          {/* left */}
          <div className="flex w-full h-full flex-col gap-3">
          <div className="px-2 py-1 group border rounded-full text-sm w-fit backdrop-blur-md flex items-center">
            <BoxesIcon size={20} className="hover:!bg-transparent rounded-full" />On-Chain Rewards for Dev Contributions
            </div>
        <h1 className="text-[6rem] leading-none font-semibold font-sora"><span className="relative z-10  bg-clip-text text-transparent bg-gradient-to-b to-neutral-200 from-neutral-800 ">Earn Crypto</span> by Solving Open Source</h1>
        <div className="flex w-full gap-6 mt-6">
    <Button
      className="text-xl px-8 py-4 font-semibold border-sky-400 text-sky-300 hover:bg-sky-900/10 backdrop-blur-md bg-[#1B1E25]  cursor-pointer  shadow-md"
    >
      Start Earning
    </Button>
    <Button
      variant="outline"
      className="text-xl px-8 py-4 cursor-pointer font-semibold"
    >
      Add Bounties
    </Button>
  </div>
        </div>

        {/* right */}
        <div className="w-full h-full">
          <RightSideLanding />
        </div>


        
        </div>  

      </div>


      {/* section 2 */}
      <div>
      <div className="flex gap-2 items-center bg-black rounded-full">
            <img src="https://avatars.githubusercontent.com/u/8079861?v=4" alt="user avatar" className="h-6 w-6 rounded-full"/>
            <span className="text-white font-semibold">@hkirat</span>
          </div>
      </div>
    </div>
  );
}