 
import ExploreButton from '@/components/fancyComponents/page';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Sparkles } from 'lucide-react';
import React from 'react'
import { useBountyDetails } from '../context/BountyContextProvider';
import Link from 'next/link';

interface Technology {
  name: string;
  color: string;
}

interface BountyIssue {
  id: string;
  title: string;
  repo: string;
  createdAt: string;
  bountyAmount: number;
  status: string;
  technologies: Technology[];
  htmlUrl: string;
}

const SuggestedBounties = () => {
  const { bountyIssues } = useBountyDetails()

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
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

  const suggestedBounties = bountyIssues.slice(0, 3);

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
      <div className='w-full'>
        {suggestedBounties.map((issue: BountyIssue) => (
          <div 
            key={issue.id} 
            className='w-full p-5 rounded-xl bg-white dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700
              hover:border-[#007AFF]/30 dark:hover:border-[#00D1FF]/30 transition-colors duration-200'
          >
            <div className='flex flex-col sm:flex-row sm:items-start justify-between gap-5'>
              <div className='flex-1 min-w-0'>
                <div className='flex flex-col gap-2.5'>
                  <div className='flex flex-col gap-1.5'>
                    <Link href={issue.htmlUrl} className='text-base hover:underline cursor-pointer sm:text-lg font-semibold text-gray-800 dark:text-gray-100 truncate'>
                      {issue.title}
                    </Link>
                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                      <span className='font-medium'>{issue.repo}</span>
                      <span className='w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600' />
                      <span>{getTimeAgo(issue.createdAt)}</span>
                    </div>
                  </div>
                  <div className='flex flex-wrap items-center gap-1.5'>
                    {issue.technologies.slice(0, 3).map((tech: Technology, index: number) => (
                      <Badge 
                        variant="outline" 
                        key={index} 
                        className='text-xs px-2 py-0.5 rounded-full font-medium'
                        style={{ 
                          borderColor: tech.color + '40', 
                          color: tech.color,
                          backgroundColor: tech.color + '10'
                        }}
                      >
                        {tech.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              <div className='flex flex-col items-end gap-2 sm:ml-4'>
                <div className='text-[#14F195] font-sora text-lg sm:text-xl font-bold whitespace-nowrap'>
                  ${issue.bountyAmount} <span className="font-normal text-gray-400 text-xs sm:text-sm">USDC</span>
                </div>
                <Badge 
                  variant="secondary" 
                  className='text-xs px-2.5 py-0.5 bg-[#007AFF]/10 text-[#007AFF] dark:bg-[#00D1FF]/10 dark:text-[#00D1FF] font-medium'
                >
                  {issue.status}
                </Badge>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SuggestedBounties