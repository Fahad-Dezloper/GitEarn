/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { useTheme } from "next-themes"
import { Badge } from "@/components/ui/badge"
import { ArchiveIcon } from "@/components/ui/archive"

const topHunters = [
  {
    id: 1,
    name: "Roger Korsgaard",
    avatar: "/placeholder.svg?height=80&width=80",
    badge: "Elite",
    verified: true,
    rank: 1,
    bounty: "$4,970",
    issuesSolved: 497,
    successRate: "90%",
    score: 83,
  },
  {
    id: 2,
    name: "Charlie Herwitz",
    avatar: "/placeholder.svg?height=80&width=80",
    badge: "Rookie",
    verified: true,
    rank: 2,
    bounty: "$3,590",
    issuesSolved: 359,
    successRate: "85%",
    score: 80,
  },
  {
    id: 3,
    name: "Ahmad Mango",
    avatar: "/placeholder.svg?height=80&width=80",
    badge: "Noobie",
    verified: true,
    rank: 3,
    bounty: "$2,480",
    issuesSolved: 248,
    successRate: "80%",
    score: 75,
  },
]

const allHunters = [
  ...topHunters,
  {
    id: 4,
    name: "Cristofer George",
    avatar: "/placeholder.svg?height=80&width=80",
    badge: "Rookie",
    verified: false,
    rank: 4,
    bounty: "$4,970",
    issuesSolved: 497,
    successRate: "90%",
    score: 66,
  },
  {
    id: 5,
    name: "Roger Korsgaard",
    avatar: "/placeholder.svg?height=80&width=80",
    badge: "Noobie",
    verified: true,
    rank: 5,
    bounty: "$4,970",
    issuesSolved: 497,
    successRate: "90%",
    score: 60,
  },
]

const highlights = [
  {
    title: "Most Tips Given",
    name: "Cristofer G.",
    avatar: "https://avatars.githubusercontent.com/u/8079861?v=4",
    value: "129",
    color: "bg-cyan-500",
  },
  {
    title: "Most Active",
    name: "Roger K.",
    avatar: "https://avatars.githubusercontent.com/u/8079861?v=4",
    value: "37",
    color: "bg-emerald-500",
  },
  {
    title: "Longest Streaks",
    name: "Dane P.",
    avatar: "https://avatars.githubusercontent.com/u/8079861?v=4",
    value: "12",
    color: "bg-violet-500",
  },
  {
    title: "Rank Change",
    name: "Nolan F.",
    avatar: "https://avatars.githubusercontent.com/u/8079861?v=4",
    value: "7",
    color: "bg-rose-500",
  },
]

export default function HuntersLeaderboard() {
  const [activeTab, setActiveTab] = useState("all")
  const { theme } = useTheme()
  const isDark = theme === "dark"

  return (
    <div className="w-full py-6 relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="bg-background/80 backdrop-blur-sm rounded-lg border shadow-sm overflow-hidden"
      >
        <table className="w-full">
          <thead>
            <tr className="border-b font-sora">
              <th className="text-left p-4 text-sm font-medium">Rank</th>
              <th className="text-left p-4 text-sm font-medium">Programmer</th>
              <th className="text-left p-4 text-sm font-medium hidden md:table-cell">Badge</th>
              {/* <th className="text-left p-4 text-sm font-medium hidden lg:table-cell">Streaks</th> */}
              <th className="text-left p-4 text-sm font-medium">Issues</th>
              <th className="text-left p-4 text-sm font-medium">Bounty</th>
              <th className="text-left p-4 text-sm font-medium"></th>
            </tr>
          </thead>
          <tbody>
  {allHunters.map((hunter, index) => {
    const isTopRank = hunter.rank <= 3;
    const bountyClass =
      parseFloat(hunter.bounty.replace('$', '')) > 1000
        ? "text-green-500 font-semibold"
        : parseFloat(hunter.bounty.replace('$', '')) > 500
        ? "text-yellow-500"
        : "text-muted-foreground";

    return (
      <motion.tr
        key={hunter.id}
        whileHover={{
          backgroundColor: isDark
            ? "rgba(255,255,255,0.05)"
            : "rgba(0,0,0,0.02)",
        }}
        className={`border-b last:border-b-0 ${isTopRank ? "bg-opacity-5" : ""}`}
      >
        <td className="p-4 font-bold text-xl">
          {hunter.rank}
        </td>
        <td className="p-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Image
                src={"https://avatars.githubusercontent.com/u/8079861?v=4"}
                alt={hunter.name}
                width={32}
                height={32}
                className="rounded-full ring-1 ring-offset-1 ring-primary"
              />
            </div>
            <span className={`font-medium text-sm ${isTopRank ? "text-primary" : ""}`}>
              {hunter.name}
            </span>
          </div>
        </td>
        <td className="p-4 text-sm hidden md:table-cell">
          <Badge variant={hunter.badge === "Elite" ? "default" : "secondary"}>
            {hunter.badge}
          </Badge>
        </td>
        <td className="p-4 font-medium">
          {hunter.issuesSolved > 10 ? (
            <span className=" ">{hunter.issuesSolved}</span>
          ) : (
            hunter.issuesSolved
          )}
        </td>
        <td className={`p-4 font-sora text-green-500`}>{hunter.bounty}</td>
        <td className="p-4">
          <ArchiveIcon size={20} />
        </td>
      </motion.tr>
    );
  })}
</tbody>
        </table>
      </motion.div>
    </div>
  )
}