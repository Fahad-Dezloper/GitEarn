/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { GithubIcon } from "@/components/ui/github";
import { motion } from "motion/react"
import Link from "next/link";
import React from 'react'

interface Bounty {
  htmlUrl: any;
  bounty: any;
  title: string;
  repo: string;
  amount: number;
  tags: string[];
  posted: string;
  technologies: {name: string, color: string}[];
}

const BountyList = ({ bounties }: { bounties: Bounty[] }) => {
  console.log("bounties here", bounties);

  function hexToRgba(hex: string, alpha: number) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  function formatDate(dateStr) {
    const [day, month, year] = dateStr.split("/").map(Number);
  
    const daySuffix = (d) => {
      if (d > 3 && d < 21) return "th";
      switch (d % 10) {
        case 1: return "st";
        case 2: return "nd";
        case 3: return "rd";
        default: return "th";
      }
    };
  
    const monthNames = [
      "", "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
  
    return `${day}${daySuffix(day)} ${monthNames[month]} ${year}`;
  }
  
    return (
    <div className="w-full grid grid-cols-3 gap-4">
        {bounties.map((bounty: Bounty, index: number) => (
        <motion.div
        key={bounty.title}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
        className="bg-white flex flex-col justify-between dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-5 shadow-sm hover:shadow-md transition-all"
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex flex-col gap-1">
            <p className="text-sm text-gray-500 dark:text-gray-400 font-mono">{bounty.repo}</p>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{bounty.title}</h3>
          </div>
          <div className="relative group">
            <span
              title={`This GitHub issue has a bounty of $${bounty.bounty}`}
              className="bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 px-3 py-1 rounded-md text-sm font-medium"
            >
              ${bounty.bounty}
            </span>
          </div>
        </div>
      
        <div className="flex flex-wrap gap-2 mb-4">
          {bounty.technologies.map((tech, i: React.Key) => (
            <span
              key={i}
              style={{backgroundColor:  hexToRgba(tech.color, 0.4)}}
              className={`text-xs font-medium   px-2 py-0.5 rounded-full`}
            >
              {tech.name}
            </span>
          ))}
        </div>
      
        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
          <span>{formatDate(bounty.posted)}</span>
          <div className="flex items-center gap-3">
            <Link
              href={bounty.htmlUrl}
              target="_blank"
              className="transition-colors"
            >
              <GithubIcon className="hover:text-blue-600 dark:hover:text-blue-400" />
            </Link>
          </div>
        </div>
      </motion.div>       
        ))}
        </div>
  )
}

export default BountyList