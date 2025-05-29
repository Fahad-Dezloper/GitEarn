/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, Sparkles, PlusCircle, Info } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDistanceToNow } from 'date-fns';
import { useBountyDetails } from '../context/BountyContextProvider';

function formatTimeAgo(dateString: string): string {
    try {
        const date = new Date(dateString);
        return formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
        console.error("Error parsing date:", dateString, error);
        return "Invalid date";
    }
}

const AddBounty = () => {
    const router = useRouter();
    const { issuesRepo } = useBountyDetails();
    const repoData = issuesRepo;

    const latestIssues = useMemo(() => {
        if (!repoData || repoData.length === 0) {
            return [];
        }

        const allIssues = repoData.flatMap(repo =>
            repo.issues.map((issue: any) => ({
                ...issue,
                repoName: repo.name, 
                repoUrl: repo.html_url 
            }))
        );

        allIssues.sort((a, b) => {
            const dateA = new Date(a.created_at).getTime();
            const dateB = new Date(b.created_at).getTime();
            if (isNaN(dateB) || isNaN(dateA)) return 0; 
            return dateB - dateA; 
        });


        return allIssues.slice(0, 8);

    }, [repoData]); 

    const handleAddBountyClick = () => {
        router.push('/earn/bounties/add');
    };

    return (
            <CardContent className='p-0'>
                {latestIssues.length === 0 ? (
                    <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                        No issues found in your repositories.
                    </div>
                ) : (
                    <>
                    {latestIssues.map((item, i) => (
                      <div key={i} className='w-full h-fit border-b border-gray-200 dark:border-gray-800 last:border-0'>
                        <div className='w-full p-4 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors'>
                            <div className='flex items-start justify-between gap-4'>
                                <div className='flex-1 min-w-0 space-y-2'>
                                    <div className='flex flex-col gap-1.5'>
                                        <span className='text-sm font-medium text-gray-900 dark:text-gray-100 line-clamp-2'>
                                            {item.title}
                                        </span>
                                        {item.labels && item.labels.length > 0 && (
                                            <div className='flex flex-wrap gap-1.5'>
                                                {item.labels.map((label: any, idx: number) => (
                                                    <span 
                                                        key={idx}
                                                        className='px-2 py-0.5 text-xs rounded-full font-medium'
                                                        style={{
                                                            backgroundColor: `#${label.color}20`,
                                                            color: `#${label.color}`,
                                                            border: `1px solid #${label.color}40`
                                                        }}
                                                    >
                                                        {label.name}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    <div className='flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400'>
                                        <span className='font-medium'>{item.repoName}</span>
                                        <span className='w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600'></span>
                                        <span>{formatTimeAgo(item.created_at)}</span>
                                        {item.assignees && item.assignees.length > 0 && (
                                            <>
                                                <span className='w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600'></span>
                                                <span className='flex items-center gap-1'>
                                                    <span className='w-2 h-2 rounded-full bg-green-500'></span>
                                                    Assigned
                                                </span>
                                            </>
                                        )}
                                    </div>
                                </div>
                                <Link 
                                    href={`/earn/bounties/add?issue=${item.id}`}
                                    className='flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors shrink-0'
                                >
                                    <ArrowRight className='w-4 h-4 text-gray-500 dark:text-gray-400' />
                                </Link>
                            </div>
                        </div>
                      </div>                    
                    ))}
                    </>
                )}
                {repoData && repoData.flatMap(r => r.issues).length > 8 && (
                    <div className="mt-6 text-center">
                        <Link 
                            href="/earn/bounties/add" 
                            className='text-base text-[#007AFF] dark:text-[#00D1FF] font-medium'
                        >
                            View All Issues <ArrowRight className='w-5 h-5 inline ml-2' />
                        </Link>
                    </div>
                )}
            </CardContent>
    );
};

export default AddBounty;