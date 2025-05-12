/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Scroll, Sheet, useClientMediaQuery } from "@silk-hq/components";
import { AlertTriangle, Calendar, ExternalLink, GitPullRequest, MessageSquare, Plus, RefreshCw, Tag, X } from "lucide-react";
import { useState, MouseEvent } from "react";
import { useBountyDetails } from "../context/BountyContextProvider";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CircleHelpIcon } from "@/components/ui/circle-help";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import axios from "axios";

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

const BountyRemovePopup = ({title, isAddingBounty, labels, repository, assignees, prRaise, issueLink, created, updated, status, latestComment, issueId, bounty, lamports}: {
  title: string;
  isAddingBounty: boolean;
  labels: Label[];
  repository: string;
  assignees: any[];
  prRaise: boolean;
  issueLink: string;
  created: string;
  updated: string;
  status: string;
  latestComment: any[];
  issueId: string;
  bounty: string;
  lamports: any;
}) => {
  const largeViewport = useClientMediaQuery("(min-width: 800px)");
  const [activityView, setActivityView] = useState<"latest" | "all">("all");
  const [selectedAssignee, setSelectedAssignee] = useState<any>(null);
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showAddFundsDialog, setShowAddFundsDialog] = useState(false);
  const [additionalFunds, setAdditionalFunds] = useState("");
  const [loading, setLoading] = useState(false);
  const [approveLoading, setApproveLoading] = useState(false);

  const {  removeBounty, approveBounty } = useBountyDetails();

  // console.log("assignees", assignees)
  console.log("latestComment", latestComment);

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

  const handleApprove = () => {

    setShowApproveDialog(true);
    // console.log("assignees here", assignees); 
    // if(assignees != null){
    //   setSelectedAssignee(assignees.user.name);
    // }else{
    //   console.error("no assignees available");
    // }
  };

  const confirmApproval = async () => {
    setApproveLoading(true);
    if (selectedAssignee) {
      // console.log("Approving payment to:", selectedAssignee.id);
      const contributorId = selectedAssignee.id;
      try{
        const res = await approveBounty(issueId, issueLink, contributorId );
      } catch(e){
        console.error("Error while approving the bounty to the user");
      }
      // Call your API, function, whatever you want with selectedAssignee
      // const res = await axios.post('/api/contributor/approve', {

      // })
      
    } else {
      console.error("No assignee selected");
    }
  };

  const handleCancel = () => {
    setShowCancelDialog(true);
  };

  // console.log("lamports", lamports);

  async function confirmCancel() {
    try{
      setLoading(true);
      // @ts-ignore
      // console.log("lamports here", lamports)
      alert(`from here ${lamports}`)
      const res = await removeBounty({issueId, issueLink, lamports});
    } catch(e){
      console.log("error occured while cancelling the bounty");
    }finally{
      setLoading(false);
      setShowCancelDialog(false);
    }
  };

  function confirmAddFunds(event: MouseEvent<HTMLButtonElement>): void {
    throw new Error("Function not implemented.");
  }


  return (
    <div className="h-full bg-white z-50 relative dark:bg-zinc-900 text-zinc-800 dark:text-zinc-100 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden flex flex-col shadow-lg">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
        <Sheet.Trigger 
          action="dismiss" 
          className="text-sm font-medium text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors"
        >
          Close
        </Sheet.Trigger>
        <Sheet.Title className="text-lg font-semibold">Manage Bounty</Sheet.Title>
        <button className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors p-1 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800">
          <RefreshCw size={16} />
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="max-h-[76vh] md:max-h-[38vw]">
      <Scroll.Root asChild className="flex-grow h-full">
        <Scroll.View className="ExampleSheetWithKeyboard-scrollView"
              scrollGestureTrap={{ yEnd: !largeViewport }}>
          <Scroll.Content className="p-4 sm:p-6 flex flex-col overflow-y-auto gap-6 sm:gap-8">
            {/* Bounty Section */}
              
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/50 rounded-lg p-3 text-sm text-blue-700 dark:text-blue-300">
                💡 Bounties are paid out once the issue is resolved and the PR is merged.
              </div>
            
            <div className="border-t border-zinc-200 dark:border-zinc-800 pt-6">
              <h3 className="text-lg font-semibold mb-4">Issue Details</h3>
              
              {/* Title and Description */}
              <div className="space-y-2 mb-6">
                <h2 className="text-xl font-bold text-zinc-900 dark:text-white">{title}</h2>
                {/* <p className="text-zinc-600 dark:text-zinc-300 leading-relaxed">{description}</p> */}
              </div>

              {/* Metadata */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg p-4 border border-zinc-200 dark:border-zinc-700 mb-6">
                <div className="space-y-1">
                  <p className="text-xs uppercase tracking-wider text-zinc-500 dark:text-zinc-400 font-medium">Created</p>
                  <p className="text-sm font-medium">{formatDate(created)}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs uppercase tracking-wider text-zinc-500 dark:text-zinc-400 font-medium">Last Updated</p>
                  <p className="text-sm font-medium">{formatDate(updated)}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs uppercase tracking-wider text-zinc-500 dark:text-zinc-400 font-medium">Status</p>
                  <div className="flex items-center gap-1.5">
                    <span className={`inline-block w-2 h-2 rounded-full ${prRaise ? "bg-blue-500" : "bg-green-500"}`}></span>
                    <p className="text-sm font-medium">{status}</p>
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
                          style={{
                            backgroundColor: hexToRgba(`#${label.color}`, 0.4),
                          }}
                        >
                          {label.name}
                        </span>
                      );
                    })()
                  ))}
                </div>
              </div>


              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div className="space-y-2">
                  <h3 className="font-semibold text-zinc-800 dark:text-zinc-100">Repository</h3>
                  <div className="px-3 py-2 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm font-mono">
                    {repository}
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold text-zinc-800 dark:text-zinc-100">Pull Request</h3>
                  <div className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 ${
                    prRaise 
                      ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800/50" 
                      : "bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/50"
                  }`}>
                    <span className={`inline-block w-2 h-2 rounded-full ${prRaise ? "bg-green-500" : "bg-amber-500"}`}></span>
                    {prRaise ? "PR raised" : "No PR yet"}
                  </div>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <h3 className="font-semibold text-zinc-800 dark:text-zinc-100">Assignees</h3>
                <div className="flex gap-2">
                  {assignees != null && assignees.map((user, i) => (
                    <div 
                      key={i} 
                      className="flex items-center gap-2 text-sm p-2 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-md"
                    >
                      <div className="w-8 h-8 overflow-hidden rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                        <img src={user.avatar_url} alt="user avatar" className="w-full h-full object-cover" />
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

              <div className="space-y-4 border-t border-zinc-200 dark:border-zinc-800 pt-6">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold text-zinc-800 dark:text-zinc-100">Recent Activity</h3>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setActivityView("latest")}
                      className={`text-xs px-2 py-1 rounded-md ${
                        activityView === "latest" 
                          ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300" 
                          : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                      }`}
                    >
                      Latest
                    </button>
                    <button 
                      onClick={() => setActivityView("all")}
                      className={`text-xs px-2 py-1 rounded-md ${
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
                            <img src={activity.user.avatar_url} alt="user_avatar" className="w-full h-full object-cover" />
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

      <div className="border-t border-zinc-200 dark:border-zinc-800 p-4 bg-zinc-50 dark:bg-zinc-900/80 backdrop-blur-sm">
          <div className="flex  justify-between">
            <Button 
              variant="outline" 
              className="bg-white w-fit dark:bg-zinc-800 border-red-200 dark:border-red-800/50 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-700 dark:hover:text-red-300"
              onClick={handleCancel}
              disabled={assignees.length > 0}
            >
              <X size={16} className="mr-2" /> Cancel Bounty
            </Button>
            
            {/* <Button 
              variant="outline"
              className="bg-white dark:bg-zinc-800 border-blue-200 dark:border-blue-800/50 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-700 dark:hover:text-blue-300"
              onClick={handleAddFunds}
            >
              <Plus size={16} className="mr-2" /> Add Funds
            </Button> */}
            
            <Button 
              className="bg-green-600 w-fit hover:bg-green-700 text-white"
              onClick={handleApprove}
            >
              Approve Bounty
            </Button>
          </div>
        </div>

        {showApproveDialog && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-xl w-full max-w-md mx-4 overflow-hidden">
                  <div className="p-4 border-b border-zinc-200 dark:border-zinc-800">
                    <h3 className="text-lg font-semibold">Approve Bounty</h3>
                    <p className="text-zinc-600 dark:text-zinc-400 text-sm">Select who should receive the {bounty} bounty</p>
                  </div>
                  
                  <div className="p-4 space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Select Assignee</label>
                <Select onValueChange={(value) => {
                    // console.log(assignees);
                        const user = assignees.find(u => u.login === value);
                        if (user) {
                          setSelectedAssignee(user);
                        }}}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a hunter" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Assignees</SelectLabel>
                              {assignees.map((user,i) => (
                                <SelectItem key={i} value={user.login} className="flex gap-2">
                                 <img src={user.avatar_url} className="h-6 w-6 rounded-full" alt="user avatar" /> {user.login}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                    </div>
                    
                    {selectedAssignee && (
                      <Card>
                        <CardHeader>
                          <CardTitle>
                            <div className="w-full flex justify-between items-center">
                            <div className="flex gap-2 items-center">
                              <img src={selectedAssignee.avatar_url} alt="user avatar" className="w-6 h-6 rounded-full" />
                              {selectedAssignee?.login}
                              </div>
                              {selectedAssignee.walletAddress ? <></> : <div className="relative group">
                                    <CircleHelpIcon
                                      size={20}
                                      className=" cursor-pointer"
                                    />
                                    <div className="absolute bottom-full right-[-182%] transform mb-2 px-2 py-1 bg-gray-800 text-white text-[10px] rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                                      This user isn’t on our platform. Invite them to register to confirm their bounty.
                                    </div>
                                  </div>}
                              </div>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div>GitHub Id: {selectedAssignee?.githubId}</div>
                          <div>Wallet: {selectedAssignee.walletAddress ? selectedAssignee.walletAddress : "User doesn't exist"}</div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                  
                  <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 flex justify-end items-center gap-3">
                    <Button 
                      variant="outline" 
                      onClick={() => setShowApproveDialog(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      className={`bg-green-600 hover:bg-green-700 text-white ${selectedAssignee?.walletAddress === null ? `cursor-not-allowed` : `cursor-pointer`}`}
                      onClick={confirmApproval}
                      disabled={selectedAssignee?.walletAddress === null || approveLoading}
                    >
                      {approveLoading ? 'Approving...' : 'Approve Payment'} 
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {showCancelDialog && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-xl w-full max-w-md mx-4 overflow-hidden">
                  <div className="p-4 border-b border-zinc-200 dark:border-zinc-800">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="text-red-500" size={20} />
                      <h3 className="text-lg font-semibold">Cancel Bounty</h3>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <p className="text-zinc-700 dark:text-zinc-300">
                      Are you sure you want to cancel the {bounty} bounty for issue &quot;<span className="font-medium">Add Rag model for projects</span>&quot;?
                    </p>
                    <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                      This action cannot be undone.
                    </p>
                  </div>
                  
                  <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 flex justify-end gap-3">
                    <Button 
                      variant="outline" 
                      onClick={() => setShowCancelDialog(false)}
                    >
                      Keep Bounty
                    </Button>
                    <Button 
                      className="bg-red-600 hover:bg-red-700 text-white"
                      onClick={confirmCancel}
                      disabled={loading}
                    >
                      {loading ? "Cancelling..." : "Yes, Cancel Bounty"}
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {showAddFundsDialog && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-xl w-full max-w-md mx-4 overflow-hidden">
                  <div className="p-4 border-b border-zinc-200 dark:border-zinc-800">
                    <h3 className="text-lg font-semibold">Add Funds to Bounty</h3>
                    <p className="text-zinc-600 dark:text-zinc-400 text-sm">Current bounty: {bounty}</p>
                  </div>
                  
                  <div className="p-4 space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="additional-amount" className="text-sm font-medium">Additional Amount (USD)</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-500">$</span>
                        <input
                          id="additional-amount"
                          type="number"
                          min="1"
                          className="w-full pl-8 pr-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                          placeholder="Enter amount"
                          value={additionalFunds}
                          onChange={(e) => setAdditionalFunds(e.target.value)}
                        />
                      </div>
                    </div>
                    
                    {additionalFunds && Number(additionalFunds) > 0 && (
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded text-sm text-blue-700 dark:text-blue-300">
                        {/* New total bounty will be: ${Number(bounty.replace('$', '')) + Number(additionalFunds)} */}
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 flex justify-end gap-3">
                    <Button 
                      variant="outline" 
                      onClick={() => setShowAddFundsDialog(false)}
                    >
                      Cancel
                    </Button>
                    <Button 
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                      onClick={confirmAddFunds}
                      disabled={!additionalFunds || Number(additionalFunds) <= 0}
                    >
                      Add Funds
                    </Button>
                  </div>
                </div>
              </div>
            )}
      </div>
  );
};

export default BountyRemovePopup;