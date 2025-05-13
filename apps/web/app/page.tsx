/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { BoxesIcon } from "@/components/ui/boxes";
import Link from "next/link";
import RightSideLanding from "./(landingpageComponent)/RightSideLanding";
import {
  Boxes,
  ChartNoAxesColumn,
} from "lucide-react";
import Marquee from "react-fast-marquee";
import { useState } from "react";
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

  return (
    <div className="flex flex-col md:gap-12 gap-4 w-full min-h-screen  overflow-x-hidden">
      <div className="flex flex-col ">
        <Navbar />

        <div className="w-full flex h-fit mainGrad relative overflow-x-hidden">
          <div className="px-4 md:px-8 lg:pl-18">
            <div className="w-full h-full flex flex-col lg:flex-row items-center gap-6 lg:gap-9 p-2 lg:p-6">
              <div className="flex w-full h-full flex-col pt-8 lg:pt-18 gap-3">
                <div className="px-2 group border rounded-full text-[10px]  md:text-xs w-fit backdrop-blur-md flex items-center bg-gradient-to-r from-[#d0f1ff] via-[#e3f5ff] to-[#d0f1ff] text-slate-800 font-semibold">
                  <BoxesIcon
                    size={18}
                    className="hover:!bg-transparent hidden md:flex rounded-full"
                  />
                  <BoxesIcon
                    size={14}
                    className="hover:!bg-transparent flex md:hidden rounded-full"
                  />
                  On-Chain Rewards for Dev Contributions
                </div>
                <h1 className="text-5xl sm:text-5xl md:text-6xl lg:text-[5.7rem] md:max-w-7xl leading-tight lg:leading-none font-semibold font-sora">
                  <span className="relative z-10 bg-clip-text text-transparent bg-gradient-to-b to-neutral-200 from-neutral-800">
                    Earn Crypto
                  </span>{" "}
                  by Solving Open Source
                </h1>

                <div className="font-roboto text-base md:text-lg mt-4 lg:mt-6 text-neutral-300">
                  Contribute to open source, claim bounties, and build your
                  on-chain reputation.
                </div>
                <Link href="/auth/signin" className="flex flex-col sm:flex-row w-full gap-4 lg:gap-6 mt-4 lg:mt-6">
                  <Button className="text-lg lg:text-xl md:flex gap-2 items-center font-semibold bg-green-600 hover:bg-green-700 transition-all duration-200 text-white backdrop-blur-md cursor-pointer shadow-md">
                    Start Earning
                  </Button>
                </Link>
              </div>

              <div className="w-full hidden md:block lg:block h-full mt-8 lg:mt-0">
                <RightSideLanding />
              </div>
            </div>
          </div>

          <div
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            className="w-full  h-fit absolute md:top-[88%] top-[90%]"
          >
            <Marquee
              pauseOnHover={true}
              speed={50}
              gradient={true}
              gradientColor="black"
              gradientWidth={50}
              className="text-xl sm:text-2xl lg:text-[2rem] font-sora"
            >
              <span className="flex gap-2 items-center">
                <img
                  src="/LOGO/solana-sol-logo.svg"
                  alt="solana logo"
                  className="w-8 h-8"
                />
                Built on Solana &nbsp;&nbsp;&nbsp;
              </span>
              Bounties Claimed Live &nbsp;&nbsp;&nbsp; Instant Crypto Rewards
              &nbsp;&nbsp;&nbsp;
              <span className="flex gap-2 items-center">
                <Boxes size={28} className="text-sky-500" />
                On-Chain Contributions &nbsp;&nbsp;&nbsp;
              </span>
              Decentralized OSS Bounties &nbsp;&nbsp;&nbsp; Rewarding Open
              Source &nbsp;&nbsp;&nbsp;
              <span className="flex gap-2 items-center">
                <ChartNoAxesColumn size={30} className="text-orange-400" />{" "}
                Climb the Leaderboard &nbsp;&nbsp;&nbsp;
              </span>
              GitHub Meets Solana &nbsp;&nbsp;&nbsp; Transparent Reputation
              System &nbsp;&nbsp;&nbsp; GitHub + Solana = GitEarn
              &nbsp;&nbsp;&nbsp; Get Paid to Contribute &nbsp;&nbsp;&nbsp;
            </Marquee>
          </div>
        </div>
      </div>

      <div
        id="howitworks"
        className="w-full h-full md:px-34 p-4 md:py-4 flex flex-col gap-3"
      >
        <h1 className="md:text-[4rem] text-[2rem] font-sora text-white font-semibold">
          How it Works
        </h1>
        <HowItWorks />
      </div>

      <div id="features" className="w-full h-full md:px-34 p-4 md:py-4">
        <h1 className="md:text-[4rem] text-[2rem] w-full text-left font-sora text-white font-semibold">
          Features
        </h1>
        <FeaturesSectionDemo />
      </div>

      <PoweredBy />

      <div id="customers" className="w-full h-full md:px-18 px-4">
        <div className="flex flex-col items-center gap-6">
          <Testimonials />
          <button
            onClick={() => {
              const tweetText = encodeURIComponent(
                "I'm using GitEarn to earn crypto by contributing to open source! Check it out at gitearn.com "
              );
              window.open(
                `https://twitter.com/intent/tweet?text=${tweetText}`,
                "_blank"
              );
            }}
            className=""
          >
            <ExploreButton
              text="Get Featured"
              link="https://twitter.com/intent/tweet?text=${tweetText}"
            />
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
