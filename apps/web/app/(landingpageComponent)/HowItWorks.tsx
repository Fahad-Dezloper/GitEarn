/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { motion } from "framer-motion";
import { useState } from "react";

const getVimeoId = (url: string) => {
  if (!url) return null;
  const match = url.match(/(?:vimeo.com\/)(\d+)/);
  return match ? match[1] : null;
};

const ContributorSteps=[
  {
    title: "Explore Bounties",
    desc: "Browse a curated list of GitHub issues that have real crypto bounties attached.",
    video: "https://vimeo.com/1084637230"
  },
  {
    title: "Earn Instantly",
    desc: "Once your pull request is reviewed and merged, Check claim your bounty. Just merge and earn.",
    video: "https://vimeo.com/1084637159",
    bot: "https://vimeo.com/1088419517"
  },
  {
    title: "Track Wallet",
    desc: "Once you claim your bounty the money will be shown in your wallet.",
    video: "https://vimeo.com/1088419557"
  },
]

const MaintainerSteps=[
  {
    title: "Add a Bounty",
    desc: "Easily attach a crypto bounty to any GitHub issue from the GitEarn dashboard or GitEarn Github Bot.",
    video: "https://vimeo.com/1084637017",
    bot: "https://vimeo.com/1088419586"
  },
  {
    title: "Track Submissions",
    desc: "Sit back and track contributor activity in real time. See who's assigned, view submitted pull requests, and follow issue progress — all within GitEarn's dashboard.",
    video: ""
  },
  {
    title: "Merge & Reward",
    desc: "Once PR is reviewed and merged, approve the bounty to the contributor via dashboard or bot.",
    video: "https://vimeo.com/1084637096",
    bot: "https://vimeo.com/1088419464"
  }
]

const VideoPlayer = ({ videoUrl }: { videoUrl: string }) => {
  const vimeoId = getVimeoId(videoUrl);
  if (!vimeoId) return null;
  
  return (
    <div className="w-full h-full">
      <iframe
        src={`https://player.vimeo.com/video/${vimeoId}?autoplay=1&muted=1&loop=1&background=1`}
        className="w-full min-h-[24vh] object-cover rounded-2xl"
        frameBorder="0"
        allow="autoplay;"
      />
    </div>
  );
};

export function HowItWorks() {
  const [activeRole, setActiveRole] = useState<"contributor" | "maintainer">("contributor");
  const [activeVideos, setActiveVideos] = useState<{ [key: number]: "video" | "bot" }>({});

  const steps = activeRole === "contributor" ? ContributorSteps : MaintainerSteps;

  return (
    <div className="w-full md:max-w-6xl mx-auto md:px-4 py-16 rounded-3xl">
      <div className="text-center mb-6">
        <h3 className="!text-[#00BCFF] font-medium mb-2">How it works</h3>
        <h2 className="text-4xl md:text-5xl font-bold max-w-3xl mx-auto">
          Earn rewards for open source
        </h2>
      </div>

      <Tabs defaultValue="contributor" className="w-full" onValueChange={(value) => setActiveRole(value as "contributor" | "maintainer")}>
        <TabsList className="grid w-full md:max-w-md mx-auto grid-cols-2 md:mb-8 mb-6">
          <TabsTrigger value="contributor">For Contributors</TabsTrigger>
          <TabsTrigger value="maintainer">For Maintainers</TabsTrigger>
        </TabsList>

        <TabsContent value={activeRole}>
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6 md:mt-12 md:px-4">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                className={`relative w-full h-auto md:h-[53vh] md:min-w-[26vw]`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2, duration: 0.5 }}
              >
                <div className={`dark:bg-card bg-[#1E1E1E] border-2 border-black flex flex-col justify-between dark:text-card-foreground text-white p-4 md:p-6 rounded-3xl h-full shadow-md ${index === 0 ? 'md:-rotate-9 md:absolute md:top-[31px]' : index === 2 ? 'md:rotate-9 md:absolute md:top-[31px]' : ''}`}>
                  <div className="flex items-center mb-2 md:mb-3">
                    <div className="relative">
                      <span className="text-3xl md:text-4xl font-bold">{`0${index + 1}`}</span>
                      <span className="absolute -top-1 -right-3 text-lime-400">★</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 h-full">
                    <h3 className="text-xl md:text-2xl lg:text-3xl font-bold mb-2 md:mb-3 mt-4 md:mt-6">{step.title}</h3>
                    <p className="dark:text-muted-foreground text-[#999999] text-xs md:text-sm mb-4 md:mb-6">{step.desc}</p>
                  </div>

                  <div className="mt-4 md:mt-0">
                    <VideoPlayer videoUrl={step.video} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
