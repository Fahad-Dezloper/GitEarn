/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { ArrowRight, Info, Sparkles } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { fetchAndSortGitHubIssues } from '@/lib/getIssues'
import Link from 'next/link'
import AddBountyButton from './AddBountyButton'

interface GitHubIssue {
  id: number;
  title: string;
  html_url: string;
  created_at: string;
  repository_url: string;
  state: string;
  repo: string;
  pull_request?: any;
}

const AddBounty = ({token}: {token: string}) => {
  const [issues, setIssues] = useState<GitHubIssue[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchIssues = async () => {
      const issuess = await fetchAndSortGitHubIssues(token);
      setIssues(issuess)
      setLoading(false)
    }
    fetchIssues()
  }, [token])

  function getTimeAgo(dateString: string) {
    const date = new Date(dateString);
    const diffTime = Math.abs(Date.now() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays} days ago`;
  }

  return (
    <div className='flex flex-col gap-3'>
      <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0'>
        <div className='flex items-center gap-2'>
          <Sparkles className='w-5 h-5 text-[#007AFF] dark:text-[#00D1FF]' />
          <h2 className='text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2'>
            Add Bounty to your latest issues 
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info size={18} className="cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Your issues get solved faster when you add a bounty!</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </h2>
        </div>

        <Link href="/earn/bounty" className='flex items-center cursor-pointer gap-2 hover:underline hover:text-[#007AFF] duration-150 ease-in-out text-sm sm:text-base'>
          All Issues <ArrowRight className='w-4 h-4 text-gray-500 dark:text-gray-400' />
        </Link>
      </div>

      <div className='w-full flex flex-col gap-3'>
        {loading ? (
          <div className="text-center py-4">Loading your issues...</div>
        ) : issues.length > 0 ? (
          issues.map((issue) => (
            <div 
              key={issue.id} 
              className='relative flex w-full flex-col p-3 sm:p-4 rounded-xl 
                bg-white dark:bg-transparent border border-gray-200 dark:hover:bg-blue-100/20 dark:border-gray-800 
                hover:shadow-md hover:border-[#007AFF]/20 dark:hover:border-[#00D1FF]/20
                transition-all duration-300 group'
            >
              <div className='flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4'>
                <div className='flex flex-col gap-1 sm:gap-2'>
                  <Link href={issue.html_url} target='_blank' className='text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-100 
                    group-hover:text-[#007AFF] dark:group-hover:text-[#00D1FF] transition-colors'>
                    {issue.title}
                  </Link>
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                    <span className='font-medium'>{issue.repo}</span>
                    <span className='hidden sm:inline w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600' />
                    <span>{getTimeAgo(issue.created_at)}</span>
                    <span className='hidden sm:inline w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600' />
                    <Badge 
                      variant="outline" 
                      className='text-[#007AFF] dark:text-[#00D1FF] 
                        border-[#007AFF]/20 dark:border-[#00D1FF]/20
                        bg-[#007AFF]/5 dark:bg-[#00D1FF]/5
                        text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded-full
                        group-hover:bg-[#007AFF]/10 dark:group-hover:bg-[#00D1FF]/10
                        transition-colors'
                    >
                      {issue.state}
                    </Badge>
                  </div>
                </div>
                <div className="flex justify-end">
                  <AddBountyButton title={issue.title} repo={issue.repo} />
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-4">No issues found</div>
        )}
      </div>
    </div>
  )
}

export default AddBounty