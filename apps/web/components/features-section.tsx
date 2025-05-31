// import { IconCloud, IconCurrencyDollar, IconEaseInOut, IconHelp, IconRouteAltLeft, IconTerminal2 } from "@tabler/icons-react";
import Image from "next/image";
import { GithubIcon } from "./ui/github";
import { MoveHorizontal, PercentIcon } from "lucide-react";
import { BoxesIcon } from "./ui/boxes";
import { CursorClickIcon } from "./ui/cursor-click";
import { AnimatedListMain } from "@/app/(landingpageComponent)/AnimatedListMain"; 

export default function FeaturesSection() {

  return (
    <section className="w-full py-16 bg-neutral-50 dark:bg-transparent">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 px-4 md:px-8 items-start">
        {/* Left: Heading, Subheading, Main Card */}
        <div className="flex flex-col gap-8">
          <div>
            <h2 className="text-4xl md:text-5xl font-sora font-bold text-neutral-900 dark:text-white mb-2">
              Monetize your <br /> Contributions.
            </h2>
            <p className="text-lg text-neutral-600 dark:text-neutral-300">
              Wherever you Contribute.
            </p>
          </div>
          {/* Main Illustration Card */}
          <div className="bg-white dark:bg-[#171717] rounded-3xl shadow-lg md:pt-8 pt-4 flex flex-col items-center justify-center md:max-h-[64vh] max-h-[33vh] relative overflow-hidden">
            <AnimatedListMain />
          </div>
        </div>




        {/* Right: Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1 */}
          <div className="bg-neutral-100 dark:bg-[#171717] rounded-2xl shadow p-6 flex flex-col items-start min-h-[160px]">
            <div className="mb-4 w-full flex justify-center">
              <div className="bg-white dark:bg-neutral-700 rounded-xl p-2 shadow">
                  <GithubIcon size={28} className="hover:bg-transparent text-neutral-900 dark:text-neutral-100" />
              </div>
            </div>
            <h3 className=" leading-tight text-md mb-2 text-neutral-900 dark:text-neutral-100 w-full text-center">
                Built for <span className="text-[#00BCFF] font-bold">open-source</span> <span className=" whitespace-nowrap">contributors & maintainers.</span>
            </h3>
          </div>


          {/* Card 2: Instant Payments */}
          <div className="bg-neutral-100 dark:bg-[#171717] rounded-2xl shadow p-6 flex flex-col items-start min-h-[160px]">
            <div className="mb-4 w-full flex justify-center">
              <div className="bg-white dark:bg-neutral-700 rounded-xl p-3 shadow">
                <PercentIcon size={28} className="hover:bg-transparent text-neutral-900 dark:text-neutral-100" />
              </div>
            </div>
            <div className="w-full flex flex-col items-center">
              <div className="bg-white dark:bg-neutral-700 rounded-lg px-4 py-2 mb-2 shadow text-center">
                <div className="text-xs text-green-600 dark:text-green-400 font-medium mb-1">Payment received</div>
                <div className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">$5,000</div>
              </div>
              <span className="text-neutral-700 dark:text-neutral-200 text-center">Zero Platform Fees</span>
            </div>
          </div>


          {/* Card 3: on chain reputation */}
          <div className="bg-neutral-100 dark:bg-[#171717] rounded-2xl shadow p-6 flex flex-col items-start min-h-[160px]">
            <div className="mb-4 w-full flex justify-center">
              <div className="bg-white dark:bg-neutral-700 rounded-xl p-2 shadow">
                <BoxesIcon size={28} className="hover:bg-transparent text-neutral-900 dark:text-neutral-100" />
              </div>
            </div>
            <div className="w-full flex flex-col items-center">
              <div className="bg-white dark:bg-neutral-700 rounded-lg px-4 py-2 mb-2 shadow flex items-center gap-2">
                <span className="ml-auto bg-blue-100 dark:bg-blue-900/30 text-[#00BCFF] dark:text-blue-300 px-3 py-1 rounded font-semibold text-xs">Coming Soon</span>
              </div>
              <span className="text-neutral-700 dark:text-neutral-200 flex flex-col items-center text-center">Your GitHub contributions are tracked and verified 
                <span className="flex items-center gap-2"><span className="font-bold text-[#00BCFF] whitespace-nowrap">on-chain</span> <MoveHorizontal size={16} /> <span className="font-bold text-[#00BCFF] whitespace-nowrap">forever.</span></span></span>
            </div>
          </div>


          {/* Card 4: Calendar & Scheduling */}
          <div className="bg-neutral-100 dark:bg-[#171717] rounded-2xl shadow p-6 flex flex-col items-start min-h-[160px]">
            <div className="mb-4 w-full flex justify-center">
              <div className="bg-white dark:bg-neutral-700 rounded-xl p-2 shadow">
                <CursorClickIcon size={28} className="hover:bg-transparent text-neutral-900 dark:text-neutral-100" />
              </div>
            </div>
            <div className="w-full flex flex-col items-center">
              <div className="bg-white dark:bg-neutral-700 rounded-lg px-4 py-2 mb-2 shadow text-center">
              One-Click Bounty Setup
              </div>
              <span className="text-neutral-700 dark:text-neutral-200 text-center">Attach bounties to any GitHub issue in seconds.</span>
            </div>
          </div>

          
          {/* Card 5: Collaboration Workflows */}
          <div className="bg-neutral-100 dark:bg-[#171717] rounded-2xl shadow p-4 sm:p-6 flex flex-col items-start min-h-[160px] md:col-span-2">
            <div className="mb-4 w-full flex justify-center">
              <div className="bg-white dark:bg-neutral-700 rounded-xl p-2 sm:p-3 shadow">
                  <Image src="/LOGO/solana-sol-logo.svg" height={24} width={30} alt="solana logo" />
              </div>
            </div>
            <div className="w-full flex flex-col items-center">
              <div className="bg-white dark:bg-neutral-700 rounded-lg px-3 sm:px-4 py-2 mb-2 shadow flex flex-col gap-1 w-full">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full gap-2 sm:gap-0">
                  <span className="font-semibold text-neutral-900 dark:text-neutral-100 text-sm sm:text-base">💸 Fix authentication flow</span>
                  <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded px-2 py-0.5 text-xs font-medium">$1,000</span>
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-2 mt-1">
                  <a href="https://github.com/fahad-Dezloper/Crowdify/" target="_blank" className="text-[#00BCFF] font-semibold rounded px-2 hover:underline cursor-pointer py-0.5 text-xs">Crowdify</a>
                  <span className="text-xs text-neutral-500 dark:text-neutral-400">Paid to @alexdev on 14/3/2024</span>
                </div>
              </div>
              <span className="text-neutral-700 dark:text-neutral-200 text-center text-sm sm:text-base">No central authority. Everything — from bounty assignment to payout — runs on <span className="text-[#9945FF] font-semibold">Solana</span>.</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// auth-library

// +$180

// Paid to @alexdev on 14/3/2024

