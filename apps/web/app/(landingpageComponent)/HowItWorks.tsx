import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

const getVimeoId = (url: string) => {
  if (!url) return null;
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
      desc: "Easily attach a crypto bounty to any GitHub issue from the GitEarn dashboard or GitEarn Github Bot. Set the amount in USD and pay in SOL, and let contributors take it from there.",
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
      desc: "Once pull request is reviewed and merged, approve the bounty to the contributor through GitEarn dashboard or via Github bot.",
      video: "https://vimeo.com/1084637096",
      bot: "https://vimeo.com/1088419464"
    }
  ]


  return (
    <Tabs defaultValue="Contributors" className="w-full">
      <TabsList className="flex justify-center w-fit gap-2 md:gap-4 mb-6 md:mb-12">
        <TabsTrigger value="Contributors" className="text-base md:text-base px-4 md:px-8 py-2 md:py-3">For Contributors</TabsTrigger>
        <TabsTrigger value="Maintainers" className="text-base md:text-base px-4 md:px-8 py-2 md:py-3">For Maintainers</TabsTrigger>
      </TabsList>
      <TabsContent className="w-full" value="Contributors">
        <div className="w-full flex flex-col gap-8 md:gap-16 max-h-[70vh] scrolll overflow-y-auto">
          {ContributorSteps.map((item, i) => (
            <div
              key={i}
              className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6 md:gap-12 bg-white dark:bg-zinc-900 rounded-xl md:rounded-2xl p-6 md:p-8 lg:p-12 shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex flex-col items-start gap-4 md:gap-6 text-zinc-900 dark:text-white w-full md:w-1/2">
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-semibold font-sora">{item.title}</h1>
                <p className="text-base md:text-lg lg:text-xl text-zinc-600 dark:text-zinc-300 leading-relaxed">{item.desc}</p>
              </div>
              {item.video && getVimeoId(item.video) && (
                <div className="w-full md:w-1/2 flex items-center justify-center mt-6 md:mt-0">
                  {item.bot ? 
                  <Tabs defaultValue="Dashboard" className="w-full flex flex-col items-center">
                  <TabsList className="">
                    <TabsTrigger value="Dashboard" className="">Dashboard</TabsTrigger>
                    <TabsTrigger value="Bot" className="">GitEarn Bot</TabsTrigger>
                  </TabsList>
                  <TabsContent className="w-full" value="Dashboard">
                  <div className="relative w-full pt-[56.25%] rounded-lg md:rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-lg">
                    <iframe
                      src={`https://player.vimeo.com/video/${getVimeoId(item.video)}?title=0&byline=0&portrait=0&badge=0&autopause=0&speed=1.25&loop=1&autoplay=1&controls=0&muted=1`}
                      className="absolute top-0 left-0 w-full h-full"
                      frameBorder="0"
                      allow="autoplay; fullscreen; picture-in-picture"
                      title={item.title}
                    />
                  </div>
                  </TabsContent>
                  <TabsContent className="w-full" value="Bot">
                  <div className="relative w-full pt-[56.25%] rounded-lg md:rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-lg">
                    <iframe
                      src={`https://player.vimeo.com/video/${getVimeoId(item.bot)}?title=0&byline=0&portrait=0&badge=0&autopause=0&speed=1.25&loop=1&autoplay=1&controls=0&muted=1`}
                      className="absolute top-0 left-0 w-full h-full"
                      frameBorder="0"
                      allow="autoplay; fullscreen; picture-in-picture"
                      title={item.title}
                    />
                  </div>
                  </TabsContent>
                  </Tabs> : <div className="relative w-full pt-[56.25%] rounded-lg md:rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-lg">
                    <iframe
                      src={`https://player.vimeo.com/video/${getVimeoId(item.video)}?title=0&byline=0&portrait=0&badge=0&autopause=0&speed=1.25&loop=1&autoplay=1&controls=0&muted=1`}
                      className="absolute top-0 left-0 w-full h-full"
                      frameBorder="0"
                      allow="autoplay; fullscreen; picture-in-picture"
                      title={item.title}
                    />
                  </div> }
                </div>
              )}
            </div>
          ))}
        </div>
      </TabsContent>
      <TabsContent value="Maintainers" className="max-h-[70vh] scrolll">
        <div className="w-full flex flex-col gap-8 md:gap-16">
          {MaintainerSteps.map((item, i) => (
            <div
              key={i}
              className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6 md:gap-12 bg-white dark:bg-zinc-900 rounded-xl md:rounded-2xl p-6 md:p-8 lg:p-12 shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex flex-col items-start gap-4 md:gap-6 text-zinc-900 dark:text-white w-full md:w-1/2">
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-semibold font-sora">{item.title}</h1>
                <p className="text-base md:text-lg lg:text-xl text-zinc-600 dark:text-zinc-300 leading-relaxed">{item.desc}</p>
              </div>
              {item.video && getVimeoId(item.video) && (
                <div className="w-full md:w-1/2 flex flex-col items-center justify-center mt-4 md:mt-0">
                  {item.bot ? 
                  <Tabs defaultValue="Dashboard" className="w-full flex flex-col items-center">
                  <TabsList className="">
                    <TabsTrigger value="Dashboard" className="">Dashboard</TabsTrigger>
                    <TabsTrigger value="Bot" className="">GitEarn Bot</TabsTrigger>
                  </TabsList>
                  <TabsContent className="w-full" value="Dashboard">
                  <div className="relative w-full pt-[56.25%] rounded-lg md:rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-lg">
                    <iframe
                      src={`https://player.vimeo.com/video/${getVimeoId(item.video)}?title=0&byline=0&portrait=0&badge=0&autopause=0&speed=1.25&loop=1&autoplay=1&controls=0&muted=1`}
                      className="absolute top-0 left-0 w-full h-full"
                      frameBorder="0"
                      allow="autoplay; fullscreen; picture-in-picture"
                      title={item.title}
                    />
                  </div>
                  </TabsContent>
                  <TabsContent className="w-full" value="Bot">
                  <div className="relative w-full pt-[56.25%] rounded-lg md:rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-lg">
                    <iframe
                      src={`https://player.vimeo.com/video/${getVimeoId(item.bot)}?title=0&byline=0&portrait=0&badge=0&autopause=0&speed=1.25&loop=1&autoplay=1&controls=0&muted=1`}
                      className="absolute top-0 left-0 w-full h-full"
                      frameBorder="0"
                      allow="autoplay; fullscreen; picture-in-picture"
                      title={item.title}
                    />
                  </div>
                  </TabsContent>
                  </Tabs> : <div className="relative w-full pt-[56.25%] rounded-lg md:rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-lg">
                    <iframe
                      src={`https://player.vimeo.com/video/${getVimeoId(item.video)}?title=0&byline=0&portrait=0&badge=0&autopause=0&speed=1.25&loop=1&autoplay=1&controls=0&muted=1`}
                      className="absolute top-0 left-0 w-full h-full"
                      frameBorder="0"
                      allow="autoplay; fullscreen; picture-in-picture"
                      title={item.title}
                    />
                  </div> }
                </div>
              )}
            </div>
          ))}
        </div>
      </TabsContent>
    </Tabs>
  )
}
