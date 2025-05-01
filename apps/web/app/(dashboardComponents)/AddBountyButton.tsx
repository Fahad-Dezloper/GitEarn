/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { Button } from '@/components/ui/button'
import { TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Tabs } from '@/components/ui/tabs'
import React, { useState } from 'react'
import { Input } from '@/components/ui/input'

const AddBountyButton = ({title, repo}: {title: any, repo: any }) => {
    const [selectedBounty, setSelectedBounty] = useState("10")
    const [customBounty, setCustomBounty] = useState("")
  return (
    <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="cursor-pointer">
                      Add Bounty
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Add Bounty to Issue</DialogTitle>
                      <DialogDescription>
                        Select a bounty amount to incentivize solving this issue.
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                      <h3 className="font-medium text-gray-900 dark:text-gray-100">{title}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{repo}</p>
                    </div>
                    
                    <Tabs defaultValue="10" className="w-full" onValueChange={setSelectedBounty}>
                      <TabsList className="grid grid-cols-4 mb-4">
                        <TabsTrigger value="10">10 USDC</TabsTrigger>
                        <TabsTrigger value="50">50 USDC</TabsTrigger>
                        <TabsTrigger value="100">100 USDC</TabsTrigger>
                        <TabsTrigger value="custom">Custom</TabsTrigger>
                      </TabsList>
                      <TabsContent value="custom" className="mt-0">
                        <div className="grid w-full items-center gap-1.5">
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
                    
                    <DialogFooter className="flex justify-end gap-2 mt-4">
                      <Button className="bg-[#007AFF] hover:bg-[#007AFF]/90">
                        Add Bounty
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
  )
}

export default AddBountyButton