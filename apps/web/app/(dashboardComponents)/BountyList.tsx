"use client"
import { motion } from "motion/react"
import React from 'react'
import { LuExternalLink } from "react-icons/lu";
import Link from 'next/link';
import { GithubIcon } from "@/components/ui/github";

interface Bounty {
  title: string;
  repo: string;
  amount: number;
  tags: string[];
  posted: string;
}

const BountyList = ({ bounties }: { bounties: Bounty[] }) => {
    return (
    <div className="w-full grid grid-cols-3 gap-4">
        {bounties.map((bounty: Bounty, index: number) => (
        <motion.div
        key={bounty.title}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
        className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-5 shadow-sm hover:shadow-md transition-all"
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex flex-col gap-1">
            <p className="text-sm text-gray-500 dark:text-gray-400 font-mono">{bounty.repo}</p>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{bounty.title}</h3>
          </div>
          {/* Bounty Amount with Tooltip */}
          <div className="relative group">
            <span
              title={`This GitHub issue has a bounty of $${bounty.amount}`}
              className="bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 px-3 py-1 rounded-md text-sm font-medium"
            >
              ${bounty.amount}
            </span>
          </div>
        </div>
      
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {bounty.tags.map((tag: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<unknown>> | Iterable<React.ReactNode> | null | undefined> | null | undefined, i: React.Key | null | undefined) => (
            <span
              key={i}
              className="text-xs font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 px-2 py-0.5 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      
        {/* Footer Meta */}
        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
          <span>{bounty.posted}</span>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="transition-colors"
            >
              <GithubIcon className="hover:text-blue-600 dark:hover:text-blue-400" />
            </Link>
            <Link
              href="/"
              target="_blank"
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              <LuExternalLink size={22} />
            </Link>
          </div>
        </div>
      </motion.div>
      
             
        ))}
        </div>
  )
}

export default BountyList