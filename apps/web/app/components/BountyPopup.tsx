/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Scroll, Sheet, useClientMediaQuery } from "@silk-hq/components";
import { Calendar, ExternalLink, GitPullRequest, MessageSquare, RefreshCw, Tag } from "lucide-react";
import { useEffect, useState } from "react";
import { useBountyDetails } from "../context/BountyContextProvider";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";

const formatDate = (iso: string) =>
  new Date(iso).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });

const formatDateRelative = (iso: string) => {
  const date = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  
  if (diffDays > 0) {
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  } else if (diffHours > 0) {
    return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  } else if (diffMinutes > 0) {
    return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
  } else {
    return 'Just now';
  }
};

interface Label {
  name: string;
  color: string;
}

interface BountyPopupProps {
  title: string;
  isAddingBounty: boolean;
  description: string;
  labels: Label[];
  repository: string;
  assignees: { avatar_url: string; login: string; }[];
  prRaise: boolean;
  issueLink: string;
  created: string;
  updated: string;
  status: string;
  latestComment: any[];
  issueId: string;
}

const BountyPopup = ({title, isAddingBounty, description, labels, repository, assignees, prRaise, issueLink, created, updated, status, latestComment, issueId}: BountyPopupProps) => {
  
// console.log("main", latestComment);
  const largeViewport = useClientMediaQuery("(min-width: 800px)");
  const [bountyAmount, setBountyAmount] = useState<string | number | null>(null);
  const [customAmount, setCustomAmount] = useState("");
  const [showCustomAmount, setShowCustomAmount] = useState(false);
  const [activityView, setActivityView] = useState<"latest" | "all">("all");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [solPrice, setSolPrice] = useState<number | null>(null);
  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();

  useEffect(() => {

    let intervalId: NodeJS.Timeout;

    const fetchSolPriceFromJupiter = async () => {
      try {
        const response = await fetch(
          "https://quote-api.jup.ag/v6/quote?inputMint=So11111111111111111111111111111111111111112&outputMint=EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v&amount=1000000000&slippageBps=50"
        );
        const data = await response.json();
        const outAmount = parseFloat(data.outAmount); 
        const usdc = outAmount / 1e6; 
        setSolPrice(usdc);
      } catch (err) {
        console.error("Error fetching SOL price from Jupiter:", err);
      }
    };
  
    fetchSolPriceFromJupiter();

    // eslint-disable-next-line prefer-const
    intervalId = setInterval(fetchSolPriceFromJupiter, 2500);

    return () => clearInterval(intervalId);
  }, []);

const usdToSol = (usdAmount: number) => {
  if (!solPrice) return "...";
  return (usdAmount / solPrice).toFixed(8);
};
  
  const { addBounty } = useBountyDetails();

  async function AddBountyToTheIssue(bountyAmt: number){
    if (!publicKey) {
      console.error("Wallet not connected");
      return;
    }

    try {
      setIsLoading(true);
      const lamports = Math.round(Number(usdToSol(bountyAmt)) * LAMPORTS_PER_SOL);

      const res = await addBounty(bountyAmt, issueId, issueLink, lamports, title);

    } catch (error) {
      console.error("Transaction failed", error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleBountySelect = (amount: string | number) => {
    if (amount === "custom") {
      setShowCustomAmount(true);
      setBountyAmount("custom");
    } else {
      setShowCustomAmount(false);
      setBountyAmount(amount);
    }
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9.]/g, '');
    
    const decimalCount = (value.match(/\./g) || []).length;
    if (decimalCount > 1) return;
    
    setCustomAmount(value);
    const numericValue = parseFloat(value);

    if (isNaN(numericValue) || numericValue <= 0) {
      setSelectedAmount(null);
    } else {
      setBountyAmount(numericValue);
      setSelectedAmount(numericValue);
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'comment':
        return <MessageSquare size={14} className="text-blue-500" />;
      case 'status':
        return <RefreshCw size={14} className="text-purple-500" />;
      case 'commit':
        return <GitPullRequest size={14} className="text-green-500" />;
      default:
        return <Calendar size={14} className="text-gray-500" />;
    }
  };



  function hexToRgba(hex: string, alpha: number) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  return (
    <div className="h-full bg-white  relative dark:bg-zinc-900 text-zinc-800 dark:text-zinc-100 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden flex flex-col shadow-lg">
      <div className="flex justify-between items-center p-3 sm:p-4 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
        <Sheet.Trigger 
          action="dismiss" 
          className="text-sm font-medium text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors"
        >
          Close
        </Sheet.Trigger>
        <Sheet.Title className="text-base sm:text-lg font-semibold">Add Bounty</Sheet.Title>
        <button className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors p-1 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800">
          <RefreshCw size={16} />
        </button>
      </div>

    <div className="max-h-[76vh] md:max-h-[38vw]">
      <Scroll.Root asChild className="flex-grow h-full">
        <Scroll.View className="ExampleSheetWithKeyboard-scrollView"
              scrollGestureTrap={{ yEnd: !largeViewport }}>
          <Scroll.Content className="p-4 sm:p-6 flex flex-col overflow-y-auto gap-6 sm:gap-8">
            <div className="space-y-3 sm:space-y-4">
              <div className="text-center space-y-2">
                <h2 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-white">Add Bounty to Issue</h2>
                <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-300">Select a bounty amount to incentivize solving this issue.</p>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4">
              {[10, 50, 100, "custom"].map((amount) => (
                  <button
                    key={amount}
                    onClick={() => handleBountySelect(amount)}
                    className={`py-2 sm:py-2.5 px-3 sm:px-4 rounded-lg font-medium transition-all text-sm sm:text-base ${
                      bountyAmount === amount 
                        ? "bg-blue-500 text-white ring-2 ring-blue-300 dark:ring-blue-500/50 ring-offset-2 dark:ring-offset-zinc-900" 
                        : "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                    }`}
                  >
                    {amount === "custom" ? (
                      "Custom"
                    ) : (
                      <>
                        ${amount}
                        <div className="text-[10px] sm:text-xs text-zinc-500">≈ {usdToSol(Number(amount))} SOL</div>
                      </>
                    )}
                  </button>
                ))}
              </div>
              
              {showCustomAmount && (
                <div className="mt-3 flex items-center">
                  <div className="relative flex-grow">
                    <div className="flex items-center relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">$</span>
                    <input
                      type="text"
                      value={customAmount}
                      onChange={handleCustomAmountChange}
                      className="w-full pl-8 pr-3 py-2.5 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter amount"
                      inputMode="decimal"
                    />
                    </div>
                    {customAmount && !isNaN(Number(customAmount)) && (
                      <div className="mt-2 text-sm text-zinc-500">
                        ≈ {usdToSol(Number(customAmount))} SOL
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/50 rounded-lg p-3 text-sm text-blue-700 dark:text-blue-300">
                💡 Bounties are paid out once the issue is resolved and the PR is merged.
              </div>
            </div>
            
            <div className="border-t border-zinc-200 dark:border-zinc-800 pt-6">
              <h3 className="text-lg font-semibold mb-4">Issue Details</h3>
              
              <div className="space-y-2 mb-6">
                <h2 className="text-xl font-bold text-zinc-900 dark:text-white">{title}</h2>
                <p className="text-zinc-600 dark:text-zinc-300 leading-relaxed">{description}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg p-3 sm:p-4 border border-zinc-200 dark:border-zinc-700 mb-4 sm:mb-6">
                <div className="space-y-1">
                  <p className="text-[10px] sm:text-xs uppercase tracking-wider text-zinc-500 dark:text-zinc-400 font-medium">Created</p>
                  <p className="text-xs sm:text-sm font-medium">{formatDate(created)}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] sm:text-xs uppercase tracking-wider text-zinc-500 dark:text-zinc-400 font-medium">Last Updated</p>
                  <p className="text-xs sm:text-sm font-medium">{formatDate(updated)}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] sm:text-xs uppercase tracking-wider text-zinc-500 dark:text-zinc-400 font-medium">Status</p>
                  <div className="flex items-center gap-1.5">
                    <span className={`inline-block w-2 h-2 rounded-full ${prRaise ? "bg-blue-500" : "bg-green-500"}`}></span>
                    <p className="text-xs sm:text-sm font-medium">{status}</p>
                  </div>
                </div>
              </div>

              {/* Labels */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-zinc-800 dark:text-zinc-100 flex items-center gap-1.5">
                    <Tag size={16} className="text-zinc-500 dark:text-zinc-400" />
                    Labels
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {labels != null && labels.map((label, i) => (
                    (() => {
                      return (
                        <span
                          key={i}
                          className="px-2.5 py-1 rounded-full text-sm font-medium flex items-center gap-1"
                          style={{backgroundColor:  hexToRgba(`#${label.color}`, 0.4)}}
                        >
                          {label.name}
                        </span>
                      );
                    })()
                  ))}
                </div>
              </div>


              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div className="space-y-2">
                  <h3 className="text-sm sm:text-base font-semibold text-zinc-800 dark:text-zinc-100">Repository</h3>
                  <div className="px-3 py-2 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-lg text-xs sm:text-sm font-mono">
                    {repository}
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm sm:text-base font-semibold text-zinc-800 dark:text-zinc-100">Pull Request</h3>
                  <div className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-medium flex items-center gap-2 ${
                    prRaise 
                      ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800/50" 
                      : "bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/50"
                  }`}>
                    <span className={`inline-block w-2 h-2 rounded-full ${prRaise ? "bg-green-500" : "bg-amber-500"}`}></span>
                    {prRaise ? "PR raised" : "No PR yet"}
                  </div>
                </div>
              </div>

              <div className="space-y-3 mb-4 sm:mb-6">
                <h3 className="text-sm sm:text-base font-semibold text-zinc-800 dark:text-zinc-100">Assignees</h3>
                <div className="flex flex-wrap gap-2">
                  {assignees.length != null && assignees.map((user, i) => (
                    <div 
                      key={i} 
                      className="flex items-center gap-2 text-xs sm:text-sm p-2 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-md"
                    >
                      <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br overflow-hidden from-blue-500 to-purple-600 flex items-center justify-center text-white text-[10px] sm:text-xs font-bold">
                        <img src={user.avatar_url} className="w-full h-full object-cover" alt="avatar url" />
                      </div>
                      <span className="font-medium">{user.login}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2 mb-6">
                <h3 className="font-semibold text-zinc-800 dark:text-zinc-100">Issue Link</h3>
                <a
                  href={issueLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors group"
                >
                  <div className="px-3 py-2 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm w-full flex justify-between items-center group-hover:border-blue-300 dark:group-hover:border-blue-500 transition-colors">
                    <span className="font-mono truncate">{issueLink}</span>
                    <ExternalLink size={14} className="flex-shrink-0" />
                  </div>
                </a>
              </div>

              <div className="space-y-4 border-t border-zinc-200 dark:border-zinc-800 pt-4 sm:pt-6">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm sm:text-base font-semibold text-zinc-800 dark:text-zinc-100">Recent Activity</h3>
                  <div className="flex gap-1 sm:gap-2">
                    <button 
                      onClick={() => setActivityView("latest")}
                      className={`text-[10px] sm:text-xs px-2 py-1 rounded-md ${
                        activityView === "latest" 
                          ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300" 
                          : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                      }`}
                    >
                      Latest
                    </button>
                    <button 
                      onClick={() => setActivityView("all")}
                      className={`text-[10px] sm:text-xs px-2 py-1 rounded-md ${
                        activityView === "all" 
                          ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300" 
                          : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                      }`}
                    >
                      All
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  {(activityView === "latest" ? [latestComment[latestComment.length - 1]] : latestComment).map((activity, idx) => (
                    <div key={idx} className="border border-zinc-200 dark:border-zinc-700 rounded-lg overflow-hidden">
                      <div className="bg-zinc-50 dark:bg-zinc-800 px-4 py-2 flex justify-between items-center border-b border-zinc-200 dark:border-zinc-700">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full overflow-hidden bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white text-xs font-bold">
                            <img src={activity.userAvatar} alt="user avatar" className="w-full h-full object-cover" />
                          </div>
                          <span className="font-medium text-sm">{activity.user.login}</span>
                          <span className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-1">
                            {getActivityIcon(activity.type)}
                            {activity.type === 'status' ? 'changed status' : activity.type}
                          </span>
                        </div>
                        <span className="text-xs text-zinc-500 dark:text-zinc-400">
                          {formatDateRelative(activity.date)}
                        </span>
                      </div>
                      <div className="p-4 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 text-sm leading-relaxed">
                        {activity.type === 'status' ? (
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded text-xs">
                              {activity.from}
                            </span>
                            <span className="text-zinc-400">→</span>
                            <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded text-xs">
                              {activity.to}
                            </span>
                          </div>
                        ) : (
                          activity.content
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Scroll.Content>
        </Scroll.View>
      </Scroll.Root>
      </div>

      <div className="border-t flex w-full items-center justify-center border-zinc-200 dark:border-zinc-800 p-2 bg-zinc-50 dark:bg-zinc-900/80 backdrop-blur-sm">
        <button onClick={() => AddBountyToTheIssue(Number(bountyAmount))}
        disabled={
          isLoading ||
          bountyAmount === null ||
          (selectedAmount !== null && selectedAmount <= 0) ||
          bountyAmount === "custom" && (customAmount.trim() === "" || isNaN(Number(customAmount)))
        }
        className={`w-full py-2.5 sm:py-3 px-4 rounded-lg text-sm sm:text-base text-white font-semibold transition-all ${
          bountyAmount === null ||
          (bountyAmount === "custom" && (customAmount.trim() === "" || isNaN(Number(customAmount))))
            ? "bg-blue-600 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700 cursor-pointer"
        }`}
      >
        {isLoading ? "Adding Bounty..." : "Add Bounty"}
        </button>
      </div>
    </div>
  );
};

export default BountyPopup;