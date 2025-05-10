/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
// @ts-nocheck
"use client"
import { useUserDetails } from "@/app/context/UserDetailsProvider";
import { useBountyDetails } from "@/app/context/BountyContextProvider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { GithubIcon } from "@/components/ui/github";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, ExternalLink } from "lucide-react";
import { SetStateAction, useEffect, useState } from "react";
import { format } from "date-fns"

export default function Page(){
    const { claimBounties, walletAdd } = useUserDetails();
    const { claimMoney } = useBountyDetails();
    // console.log("claim add", walletAdd);   

    useEffect(() => {
      if (walletAdd) {
        setWalletAddress(walletAdd);
      }
    }, [walletAdd]);

    const [selectedBounty, setSelectedBounty] = useState(null)
  const [walletAddress, setWalletAddress] = useState(walletAdd);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);



  // Conversion rate SOL to USD (example rate)
  const solToUsd = 145.32 // Current SOL to USD rate

  const handleClaim = (bounty: SetStateAction<null>) => {
    setSelectedBounty(bounty)
    setOpen(true)
  }

  const handleSubmitClaim = async (contributorId: any, walletAdd: any, bountyAmountInLamports: any, githubId: any, htmlUrl: any) => {
    try{
      setLoading(true);
      console.log("Claiming bounty", contributorId, walletAdd, bountyAmountInLamports, githubId, htmlUrl);
      const res = await claimMoney(contributorId, walletAdd, bountyAmountInLamports, githubId, htmlUrl);
      // console.log("done claiming", res);
    } catch(e){
      console.error("Error while claiming bounty", e)
    } finally {
      setLoading(false);
      setOpen(false)
      setWalletAddress(walletAdd);
    }
  }

  // Format SOL amount with 4 decimal places
  const formatSol = (lamports: number) => {
    return (lamports / 1000000000).toFixed(4)
  }

  // Calculate USD value
  const calculateUsd = (lamports: number) => {
    const solAmount = lamports / 1000000000
    return (solAmount * solToUsd).toFixed(2)
  }

  // Extract issue number from GitHub URL
  const getIssueNumber = (url: string) => {
    const parts = url.split("/")
    return parts[parts.length - 1]
  }

  // Format date to be more readable
  const formatDate = (dateString: string | number | Date) => {
    return format(new Date(dateString), "MMM d, yyyy")
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-sora font-bold">Your Claimable Bounties</h1>
      </div>
      {claimBounties && claimBounties.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {claimBounties.map((bounty: SetStateAction<null>) => (
            <Card key={bounty.id} className="shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <GithubIcon />
                  <span>Issue #{getIssueNumber(bounty.htmlUrl)}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border-l-4 border-primary pl-3 py-1">
                    <h3 className="font-medium text-lg">
                      {bounty.issueTitle || `Issue #${getIssueNumber(bounty.htmlUrl)}`}
                    </h3>
                    <a
                      href={bounty.htmlUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline mt-1"
                    >
                      View on GitHub <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>Approved on {formatDate(bounty.updatedAt)}</span>
                  </div>

                  <div className="bg-muted p-3 rounded-md">
                    <div className="flex justify-between mb-1">
                      <span className="text-muted-foreground">Amount:</span>
                      <span className="font-medium">{bounty.bountyAmount} USD</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">SOL:</span>
                      <span className="font-medium">{formatSol(bounty.bountyAmountInLamports)} SOL</span>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" onClick={() => handleClaim(bounty)}>
                  Claim Bounty
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-xl text-muted-foreground">No bounties available to claim</p>
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Claim Your Bounty</DialogTitle>
            <DialogDescription>Confirm your wallet address to receive the bounty payment.</DialogDescription>
          </DialogHeader>

          {selectedBounty && (
            <div className="py-4">
              <div className="mb-4">
                <h3 className="font-medium mb-1">
                  {selectedBounty.issueTitle || `Issue #${getIssueNumber(selectedBounty.htmlUrl)}`}
                </h3>
                <p className="text-sm text-muted-foreground">Approved on {formatDate(selectedBounty.updatedAt)}</p>
              </div>

              <div className="rounded-lg bg-muted p-4 mb-4">
                <div className="flex justify-between mb-2">
                  <span className="text-muted-foreground">Amount in SOL:</span>
                  <span className="font-bold">{formatSol(selectedBounty.bountyAmountInLamports)} SOL</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Amount in USD:</span>
                  <span className="font-bold">${calculateUsd(selectedBounty.bountyAmountInLamports)}</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="wallet">Wallet Address</Label>
                  <Input
                    id="wallet"
                    placeholder="Enter your Solana wallet address"
                    value={walletAddress}
                    onChange={(e) => setWalletAddress(e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button type="submit" className="cursor-pointer" onClick={() => handleSubmitClaim(selectedBounty.contributorId, walletAddress, selectedBounty.bountyAmountInLamports, selectedBounty.githubId, selectedBounty.htmlUrl)} disabled={!walletAddress}>
              {loading ? 'Confirming' : 'Confirm Claim'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}