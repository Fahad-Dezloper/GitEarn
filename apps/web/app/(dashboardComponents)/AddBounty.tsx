/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // Use next/navigation for App Router
import { ArrowRight, Sparkles, PlusCircle, Github, CalendarDays, Tag } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; // Assuming Card components exist
import { formatDistanceToNow } from 'date-fns'; // Using date-fns for relative time
import { useBountyDetails } from '../context/BountyContextProvider';

// Define more specific types based on your data structure
interface Label {
    name: string;
    color: string;
    description: string | null;
}

interface Assignee {
    login: string;
    avatar_url: string;
    html_url: string;
}

interface Issue {
    id: number;
    title: string;
    state: "open" | "closed"; 
    html_url: string;
    created_at: string; 
    updated_at: string;
    body: string | null;
    number: number;
    labels: Label[];
    repository: string; 
    assignees: Assignee[];
    prRaised: boolean;
    issueLink: string;
    latestComment?: any; 
    activityLog?: any[]; 
    repoName?: string; 
    repoUrl?: string;  
}

interface Repository {
    id: number;
    name: string;
    html_url: string;
    description: string | null;
    fork: boolean;
    activity: number[];
    issues: Issue[];
}

interface LatestIssuesProps {
    repoData: Repository[]; 
    isLoading?: boolean; 
}

function formatTimeAgo(dateString: string): string {
    try {
        const date = new Date(dateString);
        return formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
        console.error("Error parsing date:", dateString, error);
        return "Invalid date";
    }
}

const AddBounty: React.FC<LatestIssuesProps> = () => {
    const router = useRouter();
    const { issuesRepo } = useBountyDetails();
    const repoData = issuesRepo;
    const [isLoading, setIsLoading] = useState(false);
    if(!repoData){
        setIsLoading(true);
    }


    const latestIssues = useMemo(() => {
        if (!repoData || repoData.length === 0) {
            return [];
        }

        const allIssues = repoData.flatMap(repo =>
            repo.issues.map(issue => ({
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

    console.log("latestIssues", latestIssues);  


    if (isLoading) {
        return (
            <Card className="animate-pulse">
                <CardHeader>
                    <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
                </CardHeader>
                <CardContent className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                         <div key={i} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                             <div className="h-5 bg-gray-300 dark:bg-gray-700 rounded w-5/6 mb-2"></div>
                             <div className="flex items-center space-x-4 text-sm">
                                 <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/4"></div>
                                 <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/4"></div>
                                 <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/6"></div>
                             </div>
                         </div>
                    ))}
                </CardContent>
            </Card>
        );
    }

    return (
      <>
                <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-3'>
                        <Sparkles className='w-6 h-6 text-indigo-500 dark:text-indigo-400' />
                        <h2 className='text-xl font-semibold text-gray-900 dark:text-gray-50'>Latest Issues</h2>
                    </div>
                    <Button
                        onClick={handleAddBountyClick}
                        size="default"
                        className="bg-indigo-500 hover:bg-indigo-600 dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white px-4"
                    >
                        <PlusCircle className='w-5 h-5 mr-2' />
                        Add Bounty
                    </Button>
                </div>

            <CardContent className='p-0'>
                {latestIssues.length === 0 ? (
                    <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                        No issues found in your repositories.
                    </div>
                ) : (
                    <div className='space-y-3'>
                        {latestIssues.map((issue) => (
                            <div
                                key={issue.id}
                                className='p-4 border border-gray-200 dark:border-gray-800 rounded-lg 
                                hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors'
                            >
                                <div className='flex flex-col gap-3'>
                                    {/* Title and Labels */}
                                    <div className='flex items-start justify-between gap-4'>
                                        <Link
                                            href={issue.html_url}
                                            target='_blank'
                                            rel="noopener noreferrer"
                                            className='text-base font-medium text-gray-900 dark:text-gray-50 
                                            hover:text-indigo-600 dark:hover:text-indigo-400 flex-1'
                                        >
                                            {issue.title}
                                        </Link>
                                        <div className='flex items-center gap-2 flex-shrink-0'>
                                            {issue.labels.map((label) => (
                                                <Badge
                                                    key={label.name}
                                                    className={`text-sm px-3 py-1 rounded-full
                                                        ${label.name.includes('$') 
                                                            ? 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-700'
                                                            : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300 border border-gray-200 dark:border-gray-700'}`}
                                                >
                                                    {label.name}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                                        <Link
                                            href={issue.repoUrl || '#'}
                                            target='_blank'
                                            rel="noopener noreferrer"
                                            className='flex items-center gap-2 hover:text-gray-700 dark:hover:text-gray-300'
                                        >
                                            <Github className='w-4 h-4' />
                                            <span className="font-medium">{issue.repoName}</span>
                                        </Link>
                                        <span className="text-gray-300 dark:text-gray-600">•</span>
                                        <span>{formatTimeAgo(issue.created_at)}</span>
                                        <span className="text-gray-300 dark:text-gray-600">•</span>
                                        <span className={`font-medium ${issue.state === 'open' 
                                            ? 'text-green-600 dark:text-green-400' 
                                            : 'text-red-600 dark:text-red-400'}`}>
                                            {issue.state}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {repoData && repoData.flatMap(r => r.issues).length > 8 && (
                    <div className="mt-6 text-center">
                        <Link 
                            href="/earn/bounty" 
                            className='text-base text-indigo-600 dark:text-indigo-400 
                            hover:text-indigo-700 dark:hover:text-indigo-300 font-medium'
                        >
                            View All Issues <ArrowRight className='w-5 h-5 inline ml-2' />
                        </Link>
                    </div>
                )}
            </CardContent>
        </>
    );
};

export default AddBounty;