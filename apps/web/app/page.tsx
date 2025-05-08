"use client"
import { BoxesIcon } from "@/components/ui/boxes";
import { GithubIcon } from "@/components/ui/github";
import Link from "next/link";
import { AnimatedBeamMultipleOutputDemo } from "./(dashboardComponents)/AnimatedGihub";
import RightSideLanding from "./(landingpageComponent)/RightSideLanding";
import { BadgeCheck, Boxes, ChartNoAxesColumn, Code2, Wallet } from "lucide-react";
import { ArrowRight, CircleDot } from "lucide-react";
import { ArrowRightIcon } from "@/components/ui/arrow-right";
import { Card, CardContent } from "@/components/ui/card";
import Marquee from "react-fast-marquee";
import { useState } from "react";
import { Tabs } from "@/components/ui/tabs";
import { HowItWorks } from "./(landingpageComponent)/HowItWorks";
import FeaturesSectionDemo from "@/components/features-section-demo-2";
import { Testimonials } from "./(landingpageComponent)/Testimonials";
import ExploreButton from "@/components/fancyComponents/page";
import GitEarnFooter from "./(landingpageComponent)/GitEarnFooter";
import Navbar from "@/components/ui/Navbar";
import PoweredBy from "@/components/ui/PoweredBy";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [hovered, setHovered] = useState(false);
  const steps = [
    {
      title: "Find Bounties",
      description: "Browse open-source issues with bounties.",
      icon: <BadgeCheck className="text-blue-400 w-6 h-6" />,
    },
    {
      title: "Contribute & Submit PR",
      description: "Work on the issue and open a pull request.",
      icon: <Code2 className="text-blue-400 w-6 h-6" />,
    },
    {
      title: "Get Paid in Crypto",
      description: "Earn instantly upon approval.",
      icon: <Wallet className="text-blue-400 w-6 h-6" />,
    },
  ]

  return (
    <div className='flex flex-col gap-12 w-full min-h-screen overflow-x-hidden'>
      {/* navbar */}
      <div className="flex flex-col">
      <Navbar />

      {/* landing */}
      <div className="w-full flex h-fit mainGrad relative overflow-x-hidden ">
        <div className="pl-18">
        <div className="w-full h-full flex items-center gap-9 p-6 ">      
          {/* left */}
        <div className="flex w-full h-full flex-col pt-18 gap-3">
          <div className="px-2 group border rounded-full text-xs w-fit backdrop-blur-md flex items-center bg-gradient-to-r from-[#d0f1ff] via-[#e3f5ff] to-[#d0f1ff] text-slate-800 font-semibold">
            <BoxesIcon size={18} className="hover:!bg-transparent rounded-full" />On-Chain Rewards for Dev Contributions
            </div>
            <h1 className="text-[5.7rem]  max-w-7xl leading-none font-semibold font-sora"><span className="relative z-10 bg-clip-text text-transparent bg-gradient-to-b to-neutral-200 from-neutral-800">Earn Crypto</span> by Solving Open Source</h1>

            <div className="font-roboto text-lg mt-6 text-neutral-300">
            Contribute to open source, claim bounties, and build your on-chain reputation.
            </div>
        <div className="flex w-full gap-6 mt-6">
          <Button
            className="text-xl flex gap-2 items-center font-semibold bg-green-600 hover:bg-green-700 transition-all duration-200 text-white  backdrop-blur-md  cursor-pointer  shadow-md"
          >
            Start Earning
            {/* border-sky-400 text-sky-300 hover:bg-sky-900/10 bg-[#1B1E25] */}
          </Button>
          <Button
            variant="outline"
            className="text-xl cursor-pointer font-semibold"
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

        
        <div onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)} className="w-full h-fit absolute top-[88%]">
        <Marquee 
         pauseOnHover={true}
         speed={50}
         gradient={true}
         gradientColor="black"
         gradientWidth={50}
         className="text-[2rem] font-sora"
        >
        <span className="flex gap-2 items-center">
          <img src="/LOGO/solana-sol-logo.svg" alt="solana logo" className="w-8 h-8" />
          Built on Solana &nbsp;&nbsp;&nbsp;
        </span>
        Bounties Claimed Live &nbsp;&nbsp;&nbsp;
        Instant Crypto Rewards &nbsp;&nbsp;&nbsp;
        <span className="flex gap-2 items-center">
            <Boxes size={28} className="text-sky-500" />
            On-Chain Contributions &nbsp;&nbsp;&nbsp;
          </span> 
         Decentralized OSS Bounties &nbsp;&nbsp;&nbsp;
         Rewarding Open Source &nbsp;&nbsp;&nbsp;
          <span className="flex gap-2 items-center">
        <ChartNoAxesColumn size={30} className="text-orange-400" /> Climb the Leaderboard &nbsp;&nbsp;&nbsp;
        </span>
         GitHub Meets Solana &nbsp;&nbsp;&nbsp;
         Transparent Reputation System &nbsp;&nbsp;&nbsp;
         GitHub + Solana = GitEarn &nbsp;&nbsp;&nbsp;
         Get Paid to Contribute &nbsp;&nbsp;&nbsp;
        </Marquee>
        </div>
      </div>
      </div>


{/* section 2 */}
      <div id="howitworks" className="w-full h-full px-34 py-4 flex flex-col gap-3">
      <h1 className="text-[4rem] font-sora text-white font-semibold">How it Works</h1>
      <HowItWorks />
        </div>


{/* section 3 */}
      <div id="features" className="w-full h-full px-34 py-4">
      <h1 className="text-[4rem] w-full text-left font-sora text-white font-semibold">Features</h1>
      <FeaturesSectionDemo />
        </div>


        {/* Powered By */}
        <PoweredBy />


        {/* testimonials By */}
        <div id="customers" className="w-full h-full px-18">
          <div className="flex flex-col items-center gap-6">
            <Testimonials />
            <button
              onClick={() => {
                const tweetText = encodeURIComponent("I'm using GitEarn to earn crypto by contributing to open source! Check it out at gitearn.com ");
                window.open(`https://twitter.com/intent/tweet?text=${tweetText}`, '_blank');
              }}
              className=""
            >
                <ExploreButton text="Get Featured" link="https://twitter.com/intent/tweet?text=${tweetText}" />
            </button>
          </div>
        </div>

        {/* footer */}
        <div className="w-full h-full mt-12">
          <GitEarnFooter />
        </div>
    </div>
  );
}