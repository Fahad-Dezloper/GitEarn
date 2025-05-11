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
import { mockClaimedBounties } from "@/lib/mock-data"

// Convert lamports to SOL
const lamportsToSol = (lamports: number) => {
  return lamports / 1000000000
}

// Format SOL with 2 decimal places
const formatSol = (sol: number) => {
  return sol.toFixed(2)
}

export function BountiesClaimed() {
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({})
  const [searchQuery, setSearchQuery] = useState("")
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined
    to: Date | undefined
  }>({
    from: undefined,
    to: undefined,
  })
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([])

  const toggleRow = (id: string) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  // Calculate summary stats
  const totalClaimed = mockClaimedBounties.claimed.length
  const totalEarned = mockClaimedBounties.claimed.reduce((sum, bounty) => sum + bounty.claimedAmount, 0)
  const pendingPayouts = mockClaimedBounties.claimed
    .filter((bounty) => bounty.status === "CLAIMED" && !bounty.status.includes("APPROVED"))
    .reduce((sum, bounty) => sum + bounty.claimedAmount, 0)

  // Filter bounties based on search, date range, and status
  const filteredBounties = mockClaimedBounties.claimed.filter((bounty) => {
    // Search filter
    const matchesSearch =
      searchQuery === "" ||
      bounty.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bounty.htmlUrl.toLowerCase().includes(searchQuery.toLowerCase())

    // Date filter
    const bountyDate = new Date(bounty.createdAt)
    const matchesDateFrom = !dateRange.from || bountyDate >= dateRange.from
    const matchesDateTo = !dateRange.to || bountyDate <= dateRange.to

    // Status filter
    const matchesStatus = selectedStatuses.length === 0 || selectedStatuses.includes(bounty.status)

    return matchesSearch && matchesDateFrom && matchesDateTo && matchesStatus
  })

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold">{totalClaimed}</div>
            <p className="text-xs text-muted-foreground">Total Claimed Bounties</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold">{formatSol(lamportsToSol(totalEarned))} SOL</div>
            <p className="text-xs text-muted-foreground">Total Earned</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold">{formatSol(lamportsToSol(pendingPayouts))} SOL</div>
            <p className="text-xs text-muted-foreground">Pending Payouts</p>
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
              {["CLAIMING", "CLAIMED", "APPROVED"].map((status) => (
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
              <TableHead className="text-right">Claimed Amount</TableHead>
              <TableHead>Claim Address</TableHead>
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
                  <TableRow key={bounty.title}>
                    <TableCell className="font-medium">
                      <a
                        href={bounty.htmlUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        {bounty.title}
                      </a>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={bounty.status} />
                    </TableCell>
                    <TableCell className="text-right">{formatSol(lamportsToSol(bounty.claimedAmount))} SOL</TableCell>
                    <TableCell className="font-mono text-xs">
                      {bounty.contributorClaimedAdd.substring(0, 6)}...
                      {bounty.contributorClaimedAdd.substring(bounty.contributorClaimedAdd.length - 4)}
                    </TableCell>
                    <TableCell>{format(new Date(bounty.createdAt), "MMM dd, yyyy")}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" onClick={() => toggleRow(bounty.title)}>
                        {expandedRows[bounty.title] ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                    </TableCell>
                  </TableRow>
                  {expandedRows[bounty.title] && (
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
                              {bounty.transactions.map((transaction, index) => (
                                <TableRow key={index}>
                                  <TableCell>{format(new Date(bounty.createdAt), "MMM dd, yyyy")}</TableCell>
                                  <TableCell>{transaction.type}</TableCell>
                                  <TableCell>
                                    <StatusBadge status={transaction.status} />
                                  </TableCell>
                                  <TableCell className="text-right">
                                    {formatSol(lamportsToSol(transaction.amount))} SOL
                                  </TableCell>
                                  <TableCell>
                                    <div className="flex space-x-2">
                                      <a
                                        href={`https://explorer.solana.com/tx/${transaction.txnHash}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs text-primary hover:underline"
                                      >
                                        Explorer
                                      </a>
                                      <span className="text-xs text-muted-foreground">|</span>
                                      <a
                                        href={`https://solscan.io/tx/${transaction.txnHash}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs text-primary hover:underline"
                                      >
                                        Solscan
                                      </a>
                                    </div>
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
