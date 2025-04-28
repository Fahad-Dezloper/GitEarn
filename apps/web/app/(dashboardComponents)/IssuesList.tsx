// src/app/(dashboardComponents)/IssuesList.tsx
import * as React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, GitMerge, MessageSquare } from "lucide-react"; // Example icons
import { formatDistanceToNow } from 'date-fns'; // For relative dates
import { AddBountyIssue, ManageBountyIssue, isAddBountyIssue } from "@/types/issueTypes"; // Import the types
import { motion } from 'framer-motion';
import { AddBountyPopup } from "../components/SheetWithKeyboard/AddBountyPopup";
import Link from "next/link";
import { GithubIcon } from "@/components/ui/github";
import { RemoveBountyPopup } from "../components/SheetWithKeyboard/RemoveBountyPopup";

interface IssuesListProps {
  issues: (AddBountyIssue | ManageBountyIssue)[];
  isAddingBounty: boolean;
}


function IssueItem({ issue, isAddingBounty, index }: { issue: AddBountyIssue | ManageBountyIssue, isAddingBounty: boolean, index: number }) {
  // if(!isAddBountyIssue(issue)){
  //     console.log("isAddingBounty", issue);
  //   }
  // console.log(isAddingBounty);
  // console.log(issue);
    const commonTitle = issue.title;
    const commonUrl = isAddBountyIssue(issue) ? issue.html_url : issue.htmlUrl;
    const commonRepo = isAddBountyIssue(issue) ? issue.repositoryFullName : issue.repository;
    const commonDate = isAddBountyIssue(issue) ? new Date(issue.created_at) : issue.createdAtDate;
    const commonLabels = isAddBountyIssue(issue) ? issue.labelNames : issue.labelNames;
    // console.log("common labels", issue.labelNames);

    const formattedDate = formatDistanceToNow(commonDate, { addSuffix: true });

    return (

    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
        className="bg-white flex flex-col min-h-[25vh] justify-between dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-5 shadow-sm hover:shadow-md transition-all"
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex flex-col gap-1">
            <p className="text-sm text-gray-500 dark:text-gray-400 font-mono">{commonRepo}</p>
            <a href={commonUrl} target="_blank" rel="noopener noreferrer" className="text-lg font-semibold text-gray-900 dark:text-white">{commonTitle}</a>
          </div>
          <div className="relative">
            {isAddingBounty ? 
            <AddBountyPopup isAddingBounty={isAddingBounty} title={commonTitle} description={issue.body} labels={issue.labels} repository={commonRepo} assignees={issue.assignees} prRaise={issue.prRaised} issueLink={issue.issueLink} created={issue.created_at} updated={issue.updated_at} status={issue.state} latestComment={issue.activityLog} issueId={issue.id}  />
           : <RemoveBountyPopup bounty={issue.bounty} isAddingBounty={isAddingBounty} title={commonTitle} labels={issue.labels} repository={issue.repository} assignees={issue.assignees} prRaise={issue.prRaised} issueLink={issue.issueLink} created={issue.created_at} updated={issue.updated_at} status={issue.state} latestComment={issue.activityLog} issueId={issue.id} />}
             </div>
        </div>
      
        <div className="flex flex-wrap gap-2 mb-4">
          {commonLabels != null && commonLabels.map((label) => (
            <span
              key={label}
              className="text-xs font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 px-2 py-0.5 rounded-full"
            >
              {label}
            </span>
          ))}
          {/* {isAddBountyIssue(issue) && (
                     <Badge variant={issue.state === 'open' ? 'default' : 'destructive'} className="ml-auto capitalize">
                         {issue.state}
                     </Badge>
                 )} */}
        </div>
      
        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
          <span>#{isAddBountyIssue(issue) && `${issue.number}`} opened on{" "} <span className="underline">{isAddBountyIssue(issue) ? `opened ${formattedDate}` : `bounty added ${formattedDate}`}</span></span>
          <div className="flex items-center gap-3">
            <Link
              href={commonUrl}
              target="_blank"
              className="transition-colors"
            >
              <GithubIcon className="hover:text-blue-600 dark:hover:text-blue-400" />
            </Link>
          </div>
        </div>
      </motion.div>
    );
}


export default function IssuesList({ issues, isAddingBounty }: IssuesListProps) {
  if (issues.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-10">
        No issues found matching your criteria.
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {issues.map((issue, index) => (
        <IssueItem
            key={`${isAddingBounty ? 'add' : 'manage'}-${isAddBountyIssue(issue) ? issue.id : issue.githubId}`}
            issue={issue}
            index={index}
            isAddingBounty={isAddingBounty}
        />
      ))}
    </div>
  );
}