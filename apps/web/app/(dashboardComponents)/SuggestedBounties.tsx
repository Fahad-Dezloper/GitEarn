/* eslint-disable @typescript-eslint/ban-ts-comment */
import ExploreButton from '@/components/fancyComponents/page';
import { ArrowRight, Sparkles } from 'lucide-react';
import React from 'react'
import { useBountyDetails } from '../context/BountyContextProvider';
import Link from 'next/link';
import { motion } from 'motion/react';
import { GithubIcon } from '@/components/ui/github';

interface Technology {
  name: string; 
  color: string;
}

interface BountyIssuess {
  technologies: Technology[];
  id: string;
  title: string;
  htmlUrl: string;
  status: 'PENDING' | 'ACTIVE' | 'CLAIMING' | 'CLAIMED' | 'APPROVED' | 'CANCELLING' | 'CANCELED' | 'FAILED' | 'TIPPING' | 'TIPPED';
  bountyAmount: number;
  bountyAmountInLamports: number;
  createdAt: Date;
  repoName?: string;
  tags?: Technology[];
}

const SkeletonCard = () => (
  <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-5 w-full sm:w-[300px] md:w-[350px] animate-pulse">
    <div className="flex items-start justify-between mb-3">
      <div className="flex flex-col gap-1">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-48"></div>
      </div>
      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
    </div>
    <div className="flex flex-wrap gap-2 mb-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-5 bg-gray-200 dark:bg-gray-700 rounded-full w-20"></div>
      ))}
    </div>
    <div className="flex items-center justify-between">
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-6"></div>
    </div>
  </div>
);

const SuggestedBounties = () => {
  const { bountyIssues, isLoading } = useBountyDetails()
  // console.log("bounty issues", bountyIssues);

  const getTimeAgo = (dateString: Date | string) => {
    const now = new Date();
    const dateObj = new Date(dateString);
    const seconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30);

    if (months > 0) return `${months} ${months === 1 ? 'month' : 'months'} ago`;
    if (weeks > 0) return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
    if (days > 0) return `${days} ${days === 1 ? 'day' : 'days'} ago`;
    if (hours > 0) return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
    if (minutes > 0) return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
    return 'just now';
  };

  function hexToRgba(hex: string, alpha: number) {
    if (!hex) return `rgba(128, 128, 128, ${alpha})`; // Default to gray if no color provided
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  // @ts-ignore
  const suggestedBounties: BountyIssuess[] = bountyIssues?.slice(0, 3) || [];

  return (
    <div className='flex flex-col gap-6'>
      <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-3'>
        <div className='flex items-center gap-2.5'>
          <Sparkles className='w-5 h-5 text-[#007AFF] dark:text-[#00D1FF]' />
          <h2 className='text-xl font-semibold text-gray-800 dark:text-gray-100'>Suggested for You</h2>
        </div>
        <div className='flex items-center gap-2'>
          <ExploreButton text='Explore all bounties' link='/bounty' />
          <ArrowRight className='w-4 h-4 text-gray-500 dark:text-gray-400' />
        </div>
      </div>
      <div className='flex gap-4 scrolllx shrink-0 scrollbar-hide'>
        {isLoading ? (
          // Show skeleton loading state
          Array(3).fill(0).map((_, index) => (
            <SkeletonCard key={index} />
          ))
        ) : suggestedBounties.length > 0 ? (
          // Show actual bounties
          suggestedBounties.map((issue, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="bg-white flex md:max-w-[20vw] w-full shrink-0 max-w-[80vw] flex-col justify-between dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-5 shadow-sm hover:shadow-md transition-all cursor-pointer group"
              style={{
                '--cursor-color': 'rgb(0, 122, 255)',
                '--cursor-color-dark': 'rgb(0, 209, 255)',
              } as React.CSSProperties}
              onMouseEnter={(e) => {
                const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${document.documentElement.classList.contains('dark') ? 'rgb(0, 209, 255)' : 'rgb(0, 122, 255)'}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m4 4 7.07 17 2.51-7.39L21 11.07z"/></svg>`;
                e.currentTarget.style.cursor = `url('data:image/svg+xml;base64,${btoa(svg)}'), pointer`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.cursor = 'pointer';
              }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex flex-col gap-1">
                  <p className="text-sm text-gray-500 dark:text-gray-400 font-mono">{issue.repoName || 'Unknown Repository'}</p>
                  <Link href={issue.htmlUrl} target="_blank" className="text-md hover:underline font-semibold text-gray-900 dark:text-white">{issue.title}</Link>
                </div>
                <div className="relative group">
                  <span
                    title={`This GitHub issue has a bounty of $${issue.bountyAmount}`}
                    className="bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 px-3 py-1 rounded-md text-sm font-medium"
                  >
                    ${issue.bountyAmount}
                  </span>
                </div>
              </div>


              <div className="flex flex-col gap-3">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {/* @ts-ignore */}
                    {issue.technologies.map((tech, i) => (
                      <span
                        key={i}
                        style={{backgroundColor: hexToRgba(tech.color, 0.4)}}
                        className="text-xs font-medium px-2 py-0.5 rounded-full"
                      >
                        {tech.name}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                    <span>{getTimeAgo(issue.createdAt)}</span>
                    <div className="flex items-center gap-3">
                      <Link
                        href={issue.htmlUrl}
                        target="_blank"
                        className="transition-colors"
                      >
                        <GithubIcon className="hover:text-blue-600 dark:hover:text-blue-400 hover:bg-transparent" />
                      </Link>
                    </div>
                  </div>
              </div>

            </motion.div>
          ))
        ) : (
          // Show no bounties message
          <div className="w-full text-center py-8">
            <p className="text-gray-500 dark:text-gray-400 text-lg">No active bounties available at the moment</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default SuggestedBounties