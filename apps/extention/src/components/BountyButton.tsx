/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import {
  WalletMultiButton,
  WalletDisconnectButton
} from '@solana/wallet-adapter-react-ui'
import { useWallet } from '@solana/wallet-adapter-react'
import { useConnection } from '@solana/wallet-adapter-react'
import { PublicKey } from '@solana/web3.js'

const WalletInfo = () => {
  const { publicKey } = useWallet()
  const { connection } = useConnection()
  const [solBalance, setSolBalance] = useState<number | null>(null)

  useEffect(() => {
    const fetchBalance = async () => {
      if (publicKey) {
        const balance = await connection.getBalance(publicKey)
        setSolBalance(balance / 1e9) // Convert lamports to SOL
      }
    }
    fetchBalance()
  }, [publicKey, connection])

  if (!publicKey) return null

  return (
    <div className="text-left text-sm text-gray-800 dark:text-gray-200 mt-2">
      💰 SOL Balance: {solBalance?.toFixed(4)} SOL
    </div>
  )
}

const AddBountyButton = () => {
  const [selectedBounty, setSelectedBounty] = useState("10")
  const [customBounty, setCustomBounty] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [hideDialogContent, setHideDialogContent] = useState(false)

  const { publicKey } = useWallet()

  // Show the dialog content again once the wallet is connected
  useEffect(() => {
    if (publicKey) {
      setHideDialogContent(false)
    }
  }, [publicKey])

  const handleWalletClick = () => {
    // Hide dialog content to allow wallet modal interaction
    setHideDialogContent(true)
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="bg-[#007AFF] text-white font-semibold hover:bg-[#0062d1] transition-colors duration-200 shadow-sm border border-transparent rounded-md px-4 py-2"
        >
          ➕ Add Bounty
        </Button>
      </DialogTrigger>

      <DialogContent className={`sm:max-w-md overflow-y-auto ${hideDialogContent ? 'hidden' : ''}`}>
        <DialogHeader className="text-left">
          <DialogTitle className="text-xl font-semibold">
            Add Bounty to Issue
          </DialogTitle>
          <DialogDescription>
            Select a bounty amount to incentivize solving this issue.
          </DialogDescription>
        </DialogHeader>

        {/* Issue Preview */}
        <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-md text-left">
          <h3 className="font-medium text-gray-900 dark:text-gray-100">
            Good Work
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Antiwork/Gumroad
          </p>
        </div>

        {/* Wallet Info */}
        <div className="mb-4 text-left space-y-2">
          <div onClick={handleWalletClick}>
            <WalletMultiButton />
          </div>
          <WalletDisconnectButton />
          <WalletInfo />
        </div>

        {/* Bounty Selection */}
        <Tabs
          defaultValue="10"
          className="w-full"
          onValueChange={setSelectedBounty}
        >
          <TabsList className="grid grid-cols-4 mb-4 bg-gray-100 dark:bg-gray-700 rounded-md">
            <TabsTrigger value="10">10 USDC</TabsTrigger>
            <TabsTrigger value="50">50 USDC</TabsTrigger>
            <TabsTrigger value="100">100 USDC</TabsTrigger>
            <TabsTrigger value="custom">Custom</TabsTrigger>
          </TabsList>
          <TabsContent value="custom" className="mt-0">
            <div className="grid w-full items-center gap-1.5 text-left">
              <Label htmlFor="custom-amount">Custom Amount (USDC)</Label>
              <Input
                id="custom-amount"
                type="number"
                placeholder="Enter amount"
                value={customBounty}
                onChange={(e) => setCustomBounty(e.target.value)}
              />
            </div>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <DialogFooter className="flex justify-end gap-2 mt-4">
          <Button className="bg-[#007AFF] text-white hover:bg-[#0062d1] transition-all duration-200">
            Confirm Bounty
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default AddBountyButton
