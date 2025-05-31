/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { useState } from "react"
import { format } from "date-fns"
import { CalendarIcon, ChevronDown, ChevronUp, Search } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { cn } from "@/lib/utils"
import { mockCreatedBounties } from "@/lib/mock-data"
import { useBountyDetails } from "@/app/context/BountyContextProvider"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useWallet } from "@solana/wallet-adapter-react"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

// Convert lamports to SOL
const lamportsToSol = (lamports: number) => {
  return lamports / 1000000000
}

// Format SOL with 2 decimal places
const formatSol = (sol: number) => {
  return sol.toFixed(2)
}

export function BountiesCreated() {
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({})
  const [searchQuery, setSearchQuery] = useState("");
  const { publicKey } = useWallet();
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined
    to: Date | undefined
  }>({
    from: undefined,
    to: undefined,
  })
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([])
  const { bountiesCreated, addBounty, removeBounty, tip } = useBountyDetails();
  const [loading, setLoading] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [isTipDialogOpen, setIsTipDialogOpen] = useState(false);
  const [bountyToConfirm, setBountyToConfirm] = useState<{
    txnId: string;
    bountyAmountInLamports: number;
    htmlUrl: string;
    githubId: string;
    bountyAmount: number;
  } | null>(null);
  
  const [bountyToTip, setBountyToTip] = useState<{
    txnId: string;
    bountyAmountInLamports: number;
    htmlUrl: string;
    githubId: string;
    bountyAmount: number;
  } | null>(null);

  const [bountyToCancel, setBountyToCancel] = useState<{
    txnId: string;
    bountyAmountInLamports: number;
    htmlUrl: string;
    githubId: string;
    bountyAmount: number;
  } | null>(null);


  const toggleRow = (id: string) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  const totalBounties = bountiesCreated.length
  const totalFunded = mockCreatedBounties.bounties.reduce((sum, bounty) => sum + bounty.bountyAmount, 0)
  const totalPaidOut = mockCreatedBounties.bounties.reduce((sum, bounty) => sum + (bounty.claimedAmount || 0), 0)
  const remainingBalance = totalFunded - totalPaidOut

  const filteredBounties = bountiesCreated.filter((bounty) => {
    const matchesSearch =
      searchQuery === "" ||
      bounty.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bounty.htmlUrl.toLowerCase().includes(searchQuery.toLowerCase())


    const bountyDate = new Date(bounty.createdAt)
    const matchesDateFrom = !dateRange.from || bountyDate >= dateRange.from
    const matchesDateTo = !dateRange.to || bountyDate <= dateRange.to

    const matchesStatus = selectedStatuses.length === 0 || selectedStatuses.includes(bounty.status)

    return matchesSearch && matchesDateFrom && matchesDateTo && matchesStatus
  })

  function formatIssueTitle(url: string): string {
    try {
      const match = url.match(/github\.com\/[^/]+\/([^/]+)\/issues\/(\d+)/);
      if (!match) return 'Invalid GitHub Issue URL';
      
      const repo = match[1];
      const issueNumber = match[2];
      return `Issue #${issueNumber} · ${repo}`;
    } catch {
      return 'Error formatting issue title';
    }
  }

  async function confirmPendingBounty(txnId: string, bountyAmountInLamports: number, htmlUrl: string, githubId: string, bountyAmount: number){
    try{
      setLoading(true)
      const res = await addBounty(
        bountyAmount,           
        githubId,               
        htmlUrl,                
        bountyAmountInLamports, 
        undefined,              
        txnId                   
      );
    } catch (e){
      console.error("Error while confirming pending bounty", e);
    } finally{
      setLoading(false);
    }
  }

  async function confirmTip(txnId: string, bountyAmountInLamports: number, htmlUrl: string, githubId: string, bountyAmount: number){
    try{
      setLoading(true)
      const res = await tip(
        bountyAmount,           
        githubId,               
        htmlUrl,                
        bountyAmountInLamports, 
        undefined,              
        txnId                   
      );
    } catch (e){
      console.error("Error while confirming pending bounty", e);
    } finally{
      setLoading(false);
    }
  }

  async function confirmCancellingBounty(txnId: any, githubId: string,  htmlUrl: string, bountyAmountInLamports: number){
    try{
      setLoading(true)
      const res = await removeBounty({txnId, issueId:githubId,  issueLink:htmlUrl, lamports:bountyAmountInLamports});
      console.log("res", res);  
    } catch (e){
      console.error("Error while confirming pending bounty", e);
    } finally{
      setLoading(false);
    }
  }

  const formatter = new Intl.DateTimeFormat('en-GB', {
    year: 'numeric',
    month: 'long',
    day: '2-digit'
  });
  

  return (
    <div className="space-y-4">
      <div className="md:grid gap-4 w-full scrolllx flex overflow-y-auto md:grid-cols-2 lg:grid-cols-4">
        <Card className="shrink-0">
          <CardContent className="">
            <div className="md:text-2xl text-lg font-sora font-bold">{totalBounties}</div>
            <p className="text-xs text-muted-foreground">Total Bounties Created</p>
          </CardContent>
        </Card>
        <Card className="shrink-0">
          <CardContent className="">
            <div className="md:text-2xl text-lg font-sora font-bold">{formatSol(lamportsToSol(totalFunded))} SOL</div>
            <p className="text-xs text-muted-foreground">Total Amount Funded</p>
          </CardContent>
        </Card>
        <Card className="shrink-0">
          <CardContent className="">
            <div className="md:text-2xl text-lg font-sora font-bold">{formatSol(lamportsToSol(totalPaidOut))} SOL</div>
            <p className="text-xs text-muted-foreground">Total Paid Out</p>
          </CardContent>
        </Card>
        <Card className="shrink-0">
          <CardContent className="">
            <div className="md:text-2xl text-lg font-sora font-bold">{formatSol(lamportsToSol(remainingBalance))} SOL</div>
            <p className="text-xs text-muted-foreground">Remaining Balance</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div className="flex items-center space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-8 px-2 lg:px-3">
                Status
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {["PENDING", "ACTIVE", "CLAIMING", "CLAIMED", "APPROVED", "TIPPING", "TIPPED"].map((status) => (
                <DropdownMenuCheckboxItem
                  key={status}
                  checked={selectedStatuses.includes(status)}
                  onCheckedChange={(checked) => {
                    setSelectedStatuses((prev) => (checked ? [...prev, status] : prev.filter((s) => s !== status)))
                  }}
                >
                  {status}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "h-8 justify-start text-left font-normal lg:px-3",
                  !dateRange.from && "text-muted-foreground",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(dateRange.from, "LLL dd, y")
                  )
                ) : (
                  <span>Date range</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={dateRange.from}
                selected={{
                  from: dateRange.from,
                  to: dateRange.to,
                }}
                onSelect={(range) => {
                  setDateRange({
                    from: range?.from,
                    to: range?.to,
                  })
                }}
                numberOfMonths={1}
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="flex items-center">
          <Search className="mr-2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search bounties..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-8 w-[150px] lg:w-[250px]"
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[300px]">Bounty Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Funded Amount</TableHead>
              {/* remove maybe no point of keeping */}
              {/* <TableHead className="text-right">Claimed Amount</TableHead> */}
              <TableHead>Created Date</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBounties.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No bounties found.
                </TableCell>
              </TableRow>
            ) : (
              filteredBounties.map((bounty) => (
                <>
                  <TableRow key={bounty.id}>
                    <TableCell className="font-medium">
                      <a
                        href={bounty.htmlUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        {formatIssueTitle(bounty.htmlUrl)}
                      </a>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={bounty.status} />
                    </TableCell>
                    {/* for lamports to sol */}
                    <TableCell className="text-right">{(bounty.bountyAmountInLamports / 1e9).toFixed(4)} SOL</TableCell>
                    {/* remove maybe no point of keeping */}
                    {/* <TableCell className="text-right">
                      {bounty.claimedAmount ? `${bounty.bountyAmountInLamports} SOL` : "-"}
                    </TableCell> */}
                    {/* <TableCell>2nd April</TableCell> */}
                    <TableCell>{formatter.format(new Date(bounty.createdAt))}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" onClick={() => toggleRow(bounty.id)}>
                        {expandedRows[bounty.id] ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                    </TableCell>
                  </TableRow>
                  {expandedRows[bounty.id] && (
                    <TableRow className="bg-muted/50">
                      <TableCell colSpan={6} className="p-0">
                        <div className="p-4">
                          <h4 className="mb-2 font-semibold">Transaction Timeline</h4>
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Transaction Type</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Amount</TableHead>
                                <TableHead>Transaction Hash</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {bounty.transactions.map((txn: any, index: number) => (
                                <TableRow key={index}>
                                  {/* // {txn.createdAt} */}
                                  <TableCell>{formatter.format(new Date(txn.createdAt))}</TableCell>
                                  <TableCell>{txn.type}</TableCell>
                                  <TableCell>
                                    <StatusBadge status={txn.status} />
                                  </TableCell>
                                  <TableCell className="text-right">
                                    {/* convert lamports to sol and then in dollars */}
                                    {(txn.bountyAmountInLamports / 1e9).toFixed(4)}
                                  </TableCell>
                                  <TableCell>
                                    {/* {txn.type === "PENDING"} */}
                                    {txn.txnHash !== null && 
                                      <div className="flex space-x-2 whitespace-nowrap">
                                      <a
                                        href={`https://explorer.solana.com/tx/${txn.txnHash}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs text-primary hover:underline"
                                      >
                                        Explorer
                                      </a>
                                      <span className="text-xs text-muted-foreground">|</span>
                                      <a
                                        href={`https://solscan.io/tx/${txn.txnHash}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs text-primary hover:underline"
                                      >
                                        Solscan
                                      </a>
                                    </div>
                                    }

                                    {/* Show Confirm Tip button when bounty status is TIPPING */}
                                    {bounty.status === "TIPPING" && txn.type === "PAYOUT" && txn.status === "PENDING" && 
                                      <Button onClick={() => {
                                        setIsTipDialogOpen(true);
                                        setBountyToTip({
                                          txnId: txn.id,
                                          bountyAmountInLamports: bounty.bountyAmountInLamports,
                                          htmlUrl: bounty.htmlUrl,
                                          githubId: bounty.githubId,
                                          bountyAmount: bounty.bountyAmount
                                        });
                                      }} className="cursor-pointer">Confirm Tip</Button>
                                    }

                                    {/* Show Confirm Payment button when bounty status is NOT TIPPING */}
                                    {bounty.status !== "TIPPING" && txn.type === "DEPOSIT" && txn.status === "PENDING" && 
                                      <Button onClick={() => {
                                        setIsConfirmDialogOpen(true);
                                        setBountyToConfirm({
                                          txnId: txn.id,
                                          bountyAmountInLamports: bounty.bountyAmountInLamports,
                                          htmlUrl: bounty.htmlUrl,
                                          githubId: bounty.githubId,
                                          bountyAmount: bounty.bountyAmount
                                        });
                                      }} className="cursor-pointer">Confirm Payment</Button>
                                    }

                                    {txn.type === "WITHDRAWAL" && txn.status === "PENDING" && 
                                    <Button onClick={() => {
                                      setIsCancelDialogOpen(true);
                                      setBountyToCancel({
                                        txnId: txn.id,
                                        bountyAmountInLamports: bounty.bountyAmountInLamports,
                                        htmlUrl: bounty.htmlUrl,
                                        githubId: bounty.githubId,
                                        bountyAmount: bounty.bountyAmount
                                      });
                                    }} className="cursor-pointer">Transfer Back</Button>
                                    }

                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </>
              ))
            )}
          </TableBody>
        </Table>
      </div>



      {/* is tip dialog */}
      <Dialog open={isTipDialogOpen} onOpenChange={(open) => {
        setIsTipDialogOpen(open);
        if (!open) setBountyToTip(null);
      }}>
        <DialogContent className="sm:max-w-[425px] dark:bg-[#171717]">
          <DialogHeader>
            <DialogTitle>Confirm Tip Payment</DialogTitle>
            <DialogDescription>
              Please review the details below before confirming the payment.
            </DialogDescription>
          </DialogHeader>
          {bountyToTip && (
            <dl className="bg-muted/30 dark:bg-black rounded-md px-4 py-3 space-y-3 border">
              <div className="flex flex-col gap-1">
                <dt className="font-semibold text-muted-foreground">Bounty URL</dt>
                <dd>
                  <a href={bountyToTip.htmlUrl} target="_blank" rel="noopener noreferrer" className="text-primary underline break-all">
                    {bountyToTip.htmlUrl}
                  </a>
                </dd>
              </div>
              <div className="flex flex-col gap-1">
                <dt className="font-semibold text-muted-foreground">GitHub ID</dt>
                <dd>{bountyToTip.githubId}</dd>
              </div>
              <div className="flex flex-col gap-1">
                <dt className="font-semibold text-muted-foreground">Bounty Amount</dt>
                <dd>${bountyToTip.bountyAmount} <span className="text-xs text-muted-foreground"></span></dd>
              </div>


               <div className="flex flex-col gap-1">
                  <dt className="font-semibold text-muted-foreground">Bounty Amount (SOL)</dt>
                  <dd className="flex items-center gap-2">
                    {(bountyToTip.bountyAmountInLamports / 1e9).toLocaleString(undefined, {
                      minimumFractionDigits: 4,
                      maximumFractionDigits: 4,
                    })} SOL
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span
                          className="text-muted-foreground cursor-pointer hover:underline"
                          // onClick={copyToClipboard}
                        >
                          - {bountyToTip.bountyAmountInLamports.toLocaleString()} LAMPORTS
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>1 SOL = 1,000,000,000 lamports.</p>
                      </TooltipContent>
                    </Tooltip>
                  </dd>
                </div>

              <div className="flex flex-col gap-1">
                <dt className="font-semibold text-muted-foreground">Transaction ID</dt>
                <dd className="break-all">{bountyToTip.txnId}</dd>
              </div>
            </dl>
          )}
          <DialogFooter className="flex flex-row gap-3 justify-end mt-4">
            <Button variant="outline" onClick={() => {
              setIsTipDialogOpen(false);
              setBountyToTip(null);
            }}>Cancel</Button>
            <Button
              type="button"
              disabled={loading}
              onClick={async () => {
                if (bountyToTip) {
                  await confirmTip(
                    bountyToTip.txnId,
                    bountyToTip.bountyAmountInLamports,
                    bountyToTip.htmlUrl,
                    bountyToTip.githubId,
                    bountyToTip.bountyAmount
                  )
                  setIsTipDialogOpen(false);
                  setBountyToTip(null);
                }
              }}
            >
              {loading ? "Confirming..." : "Confirm Tip"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>


      {/* is confirm dialog */}
      <Dialog open={isConfirmDialogOpen} onOpenChange={(open) => {
        setIsConfirmDialogOpen(open);
        if (!open) setBountyToConfirm(null);
      }}>
        <DialogContent className="sm:max-w-[425px] dark:bg-[#171717]">
          <DialogHeader>
            <DialogTitle>Confirm Payment</DialogTitle>
            <DialogDescription>
              Please review the details below before confirming the payment.
            </DialogDescription>
          </DialogHeader>
          {bountyToConfirm && (
            <dl className="bg-muted/30 dark:bg-black rounded-md px-4 py-3 space-y-3 border">
              <div className="flex flex-col gap-1">
                <dt className="font-semibold text-muted-foreground">Bounty URL</dt>
                <dd>
                  <a href={bountyToConfirm.htmlUrl} target="_blank" rel="noopener noreferrer" className="text-primary underline break-all">
                    {bountyToConfirm.htmlUrl}
                  </a>
                </dd>
              </div>
              <div className="flex flex-col gap-1">
                <dt className="font-semibold text-muted-foreground">GitHub ID</dt>
                <dd>{bountyToConfirm.githubId}</dd>
              </div>
              <div className="flex flex-col gap-1">
                <dt className="font-semibold text-muted-foreground">Bounty Amount</dt>
                <dd>${bountyToConfirm.bountyAmount} <span className="text-xs text-muted-foreground"></span></dd>
              </div>


               <div className="flex flex-col gap-1">
                  <dt className="font-semibold text-muted-foreground">Bounty Amount (SOL)</dt>
                  <dd className="flex items-center gap-2">
                    {(bountyToConfirm.bountyAmountInLamports / 1e9).toLocaleString(undefined, {
                      minimumFractionDigits: 4,
                      maximumFractionDigits: 4,
                    })} SOL
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span
                          className="text-muted-foreground cursor-pointer hover:underline"
                          // onClick={copyToClipboard}
                        >
                          - {bountyToConfirm.bountyAmountInLamports.toLocaleString()} LAMPORTS
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>1 SOL = 1,000,000,000 lamports.</p>
                      </TooltipContent>
                    </Tooltip>
                  </dd>
                </div>

              <div className="flex flex-col gap-1">
                <dt className="font-semibold text-muted-foreground">Transaction ID</dt>
                <dd className="break-all">{bountyToConfirm.txnId}</dd>
              </div>
            </dl>
          )}
          <DialogFooter className="flex flex-row gap-3 justify-end mt-4">
            <Button variant="outline" onClick={() => {
              setIsConfirmDialogOpen(false);
              setBountyToConfirm(null);
            }}>Cancel</Button>
            <Button
              type="button"
              disabled={loading}
              onClick={async () => {
                if (bountyToConfirm) {
                  await confirmPendingBounty(
                    bountyToConfirm.txnId,
                    bountyToConfirm.bountyAmountInLamports,
                    bountyToConfirm.htmlUrl,
                    bountyToConfirm.githubId,
                    bountyToConfirm.bountyAmount
                  )
                  setIsConfirmDialogOpen(false);
                  setBountyToConfirm(null);
                }
              }}
            >
              {loading ? "Confirming..." : "Confirm"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>


      {/* is cancel dialog */}
      <Dialog open={isCancelDialogOpen} onOpenChange={(open) => {
        setIsCancelDialogOpen(open);
        if (!open) setBountyToCancel(null);
      }}>
        <DialogContent className="sm:max-w-[425px] dark:bg-[#171717]x">
          <DialogHeader>
            <DialogTitle>Confirm Payment</DialogTitle>
            <DialogDescription>
              Please review the details below before confirming the payment.
            </DialogDescription>
          </DialogHeader>
          {bountyToCancel && (
            <dl className="bg-muted/30 dark:bg-black rounded-md px-4 py-3 space-y-3 border">
              <div className="flex flex-col gap-1">
                <dt className="font-semibold text-muted-foreground">Bounty URL</dt>
                <dd>
                  <a href={bountyToCancel.htmlUrl} target="_blank" rel="noopener noreferrer" className="text-primary underline break-all">
                    {bountyToCancel.htmlUrl}
                  </a>
                </dd>
              </div>
              <div className="flex flex-col gap-1">
                <dt className="font-semibold text-muted-foreground">GitHub ID</dt>
                <dd>{bountyToCancel.githubId}</dd>
              </div>
              <div className="flex flex-col gap-1">
                <dt className="font-semibold text-muted-foreground">Bounty Amount</dt>
                <dd>{bountyToCancel.bountyAmount} <span className="text-xs text-muted-foreground">(SOL)</span></dd>
              </div>
              <div className="flex flex-col gap-1">
                <dt className="font-semibold text-muted-foreground">Bounty Amount (Lamports)</dt>
                <dd>{bountyToCancel.bountyAmountInLamports}</dd>
              </div>
              <div className="flex flex-col gap-1">
                <dt className="font-semibold text-muted-foreground">Transaction ID</dt>
                <dd className="break-all">{bountyToCancel.txnId}</dd>
              </div>
              <div className="flex flex-col gap-1">
                <dt className="font-semibold text-muted-foreground">Wallet Address</dt>
                <dd className="break-all">{publicKey?.toString()}</dd>
              </div>
            </dl>
          )}
          <DialogFooter className="flex flex-row gap-3 justify-end mt-4">
            <Button variant="outline" onClick={() => {
              setIsCancelDialogOpen(false);
              setBountyToCancel(null);
            }}>Cancel</Button>
            <Button
              type="button"
              className="cursor-pointer"
              disabled={loading}
              onClick={async () => {
                if (bountyToCancel) {
                  await confirmCancellingBounty(
                    bountyToCancel.txnId,
                    bountyToCancel.githubId,
                    bountyToCancel.htmlUrl,
                    bountyToCancel.bountyAmountInLamports
                  )
                  setIsCancelDialogOpen(false);
                  setBountyToCancel(null);
                }
              }}
            >
              {loading ? "Confirming..." : "Confirm"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  let variant: "default" | "secondary" | "destructive" | "outline" | null | undefined = "default"

  switch (status) {
    case "PENDING":
      variant = "outline"
      break
    case "ACTIVE":
      variant = "default"
      break
    case "CLAIMING":
      variant = "secondary"
      break
    case "CLAIMED":
      variant = "secondary"
      break
    case "APPROVED":
      variant = "default"
      break
    case "CONFIRMED":
      variant = "default"
      break
    case "FAILED":
      variant = "destructive"
      break
    default:
      variant = "outline"
  }

  return <Badge variant={variant}>{status}</Badge>
}
