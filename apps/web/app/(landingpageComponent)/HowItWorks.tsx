import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

const getVimeoId = (url: string) => {
  if (!url) return null;
  // Extract the video ID from the Vimeo URL
  const match = url.match(/(?:vimeo.com\/)(\d+)/);
  return match ? match[1] : null;
};

export function HowItWorks() {

  const ContributorSteps=[
    {
      title: "Explore Bounties",
      desc: "Browse a curated list of GitHub issues that have real crypto bounties attached. Use filters to sort by repository, tags, or difficulty and find tasks that match your skills and interests",
      video: "https://vimeo.com/1084637230"
    },
    {
      title: "Earn Instantly",
      desc: "Once your pull request is reviewed and merged, Check your claim bounty section to claim your bounty. Just merge and earn.",
      video: "https://vimeo.com/1084637159"
    },
    {
      title: "Track Wallet",
      desc: "Once you claim your bounty the money will be shown in your wallet.",
      video: "https://vimeo.com/1084637306"
    },
  ]


  const MaintainerSteps=[
    {
      title: "Add a Bounty",
      desc: "Easily attach a crypto bounty to any GitHub issue from the GitEarn dashboard or browser extension. Set the amount in USD and pay in SOL, and let contributors take it from there.",
      video: "https://vimeo.com/1084637017"
    },
    {
      title: "Track Submissions",
      desc: "Sit back and track contributor activity in real time. See who's assigned, view submitted pull requests, and follow issue progress — all within GitEarn's dashboard.",
      video: ""
    },
    {
      title: "Merge & Reward",
      desc: "Once your pull request is reviewed and merged, approve the bounty to the contributor through GitEarn dashboard.",
      video: "https://vimeo.com/1084637096"
    }
  ]


  return (
    <Tabs defaultValue="Contributors" className="w-full mx-auto">
      <TabsList className="flex justify-center w-fit gap-2 mb-6">
        <TabsTrigger value="Contributors">For Contributors</TabsTrigger>
        <TabsTrigger value="Maintainers">For Maintainers</TabsTrigger>
      </TabsList>
      <TabsContent className="w-full" value="Contributors">
        <div className="w-full flex flex-col gap-12">
          {ContributorSteps.map((item, i) => (
            <div
              key={i}
              className="flex flex-col md:flex-row items-center md:items-start justify-between gap-8 bg-[#18181b] rounded-xl p-6 shadow-sm"
            >
              <div className="flex flex-col items-start gap-4 text-white w-full md:w-1/2">
                <h1 className="text-2xl md:text-3xl font-semibold font-sora mb-1">{item.title}</h1>
                <p className="text-base md:text-lg text-gray-300">{item.desc}</p>
              </div>
              {item.video && getVimeoId(item.video) && (
                <div className="w-full md:w-1/2 flex items-center justify-center mt-6 md:mt-0">
                  <div className="relative w-full pt-[56.25%] rounded-lg overflow-hidden border border-[#222]">
                    <iframe
                      src={`https://player.vimeo.com/video/${getVimeoId(item.video)}?title=0&byline=0&portrait=0&badge=0&autopause=0`}
                      className="absolute top-0 left-0 w-full h-full"
                      frameBorder="0"
                      allow="autoplay; fullscreen; picture-in-picture"
                      title={item.title}
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </TabsContent>
      <TabsContent value="Maintainers">
        <div className="w-full flex flex-col gap-12">
          {MaintainerSteps.map((item, i) => (
            <div
              key={i}
              className="flex flex-col md:flex-row items-center md:items-start justify-between gap-8 bg-[#18181b] rounded-xl p-6 shadow-sm"
            >
              <div className="flex flex-col items-start gap-4 text-white w-full md:w-1/2">
                <h1 className="text-2xl md:text-3xl font-semibold font-sora mb-1">{item.title}</h1>
                <p className="text-base md:text-lg text-gray-300">{item.desc}</p>
              </div>
              {item.video && getVimeoId(item.video) && (
                <div className="w-full md:w-1/2 flex items-center justify-center mt-6 md:mt-0">
                  <div className="relative w-full pt-[56.25%] rounded-lg overflow-hidden border border-[#222]">
                    <iframe
                      src={`https://player.vimeo.com/video/${getVimeoId(item.video)}?title=0&byline=0&portrait=0&badge=0&autopause=0`}
                      className="absolute top-0 left-0 w-full h-full"
                      frameBorder="0"
                      allow="autoplay; fullscreen; picture-in-picture"
                      title={item.title}
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </TabsContent>
    </Tabs>
  )
}
