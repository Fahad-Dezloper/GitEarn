import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { GitCommitVerticalIcon } from "@/components/ui/git-commit-vertical"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

export function HowItWorks() {

  const ContributorSteps=[
    {
      title: "Explore Bounties",
      desc: "Browse a curated list of GitHub issues that have real crypto bounties attached. Use filters to sort by repository, tags, or difficulty and find tasks that match your skills and interests",
      image: "/dashboard/dash.png"
    },
    {
      title: "Fix the Issue",
      desc: "Pick a bounty you want to work on. Clone the repo, start solving the issue, and submit a pull request like you normally would. Your activity is automatically tracked through GitHub.",
      image: "/dashboard/dash.png"
    },
    {
      title: "Earn Instantly",
      desc: "Once your pull request is reviewed and merged, GitEarn triggers an on-chain payout directly to your wallet — no invoices, no waiting. Just merge and earn.",
      image: "/dashboard/dash.png"
    }
  ]


  const MaintainerSteps=[
    {
      title: "Add a Bounty",
      desc: "Easily attach a crypto bounty to any GitHub issue from the GitEarn dashboard or browser extension. Set the amount, choose a token, and let contributors take it from there.",
      image: "/dashboard/dash.png"
    },
    {
      title: "Track Submissions",
      desc: "Sit back and track contributor activity in real time. See who's assigned, view submitted pull requests, and follow issue progress — all within GitEarn's dashboard.",
      image: "/dashboard/dash.png"
    },
    {
      title: "Merge & Reward",
      desc: "Once your pull request is reviewed and merged, GitEarn triggers an on-chain payout directly to your wallet — no invoices, no waiting. Just merge and earn.",
      image: "/dashboard/dash.png"
    }
  ]


  return (
    <Tabs defaultValue="Contributors" className="w">
      <TabsList className="grid w-fit grid-cols-2">
        <TabsTrigger value="Contributors">For Contributors</TabsTrigger>
        <TabsTrigger value="Maintainers">For Maintainers</TabsTrigger>
      </TabsList>
      <TabsContent className="w-full" value="Contributors">
        <div className="w-full h-[80vh] inset-shadoww flex flex-col gap-36 px-20 py-42 border-2 scrolll border-[#262626] rounded-2xl overflow-y-auto overflow-x-hidden">
            
            {/* step 1 */}
            {ContributorSteps.map((item, i) => (
              <div key={i} className="flex justify-between gap-6">
              <div className="flex flex-col items-start gap-20 text-white">
                  <div className="">
                      <GitCommitVerticalIcon className="hover:bg-transparent mainGrad2 p-4 rounded-full border-2" />
                  </div>
                  <div className="flex flex-col gap-4">
                  <div className="flex gap-1 items-center">
                      <h1 className="text-4xl font-sora">{item.title}</h1>
                  </div>
                      <p>{item.desc}</p>
                      </div>
              </div>

              <div className="w-full h-full flex items-center justify-center ">
                  <div className="w-[40vw] h-[40vh] rounded-2xl overflow-hidden">
                  <img src={item.image} alt="Dashboard image" className="w-full h-full object-contain" />
                  </div>
              </div>
              </div>
            ))}
            

        </div>
      </TabsContent>
      <TabsContent value="Maintainers">
      <div className="w-full h-[80vh] inset-shadoww flex flex-col gap-36 px-20 py-42 border-2 scrolll border-[#262626] rounded-2xl overflow-y-auto overflow-x-hidden">
      {MaintainerSteps.map((item, i) => (
              <div key={i} className="flex justify-between gap-6">
              <div className="flex flex-col items-start gap-20 text-white">
                  <div className="">
                      <GitCommitVerticalIcon className="hover:bg-transparent mainGrad2 p-4 rounded-full border-2" />
                  </div>
                  <div className="flex flex-col gap-4">
                  <div className="flex gap-1 items-center">
                      <h1 className="text-4xl font-sora">{item.title}</h1>
                  </div>
                      <p>{item.desc}</p>
                      </div>
              </div>

              <div className="w-full h-full flex items-center justify-center ">
                  <div className="w-[40vw] h-[40vh] rounded-2xl overflow-hidden">
                  <img src={item.image} alt="Dashboard image" className="w-full h-full object-contain" />
                  </div>
              </div>
              </div>
            ))}
      </div>
      </TabsContent>
    </Tabs>
  )
}
