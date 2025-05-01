// src/app/(dashboardComponents)/IssuesList.tsx
import * as React from "react";
import { formatDistanceToNow } from 'date-fns'; 
import { AddBountyIssue, ManageBountyIssue, isAddBountyIssue } from "@/types/issueTypes"; 
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
    const commonTitle = issue.title;
    const commonUrl = isAddBountyIssue(issue) ? issue.html_url : issue.htmlUrl;
    const commonRepo = isAddBountyIssue(issue) ? issue.repositoryFullName : issue.repository;
    const commonDate = isAddBountyIssue(issue) ? new Date(issue.created_at) : issue.createdAtDate;
    const commonLabels = isAddBountyIssue(issue) ? issue.labelNames : issue.labelNames;
    // console.log("common labels", issue.labelNames);
    // console.log("issues here", issue);

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
            <AddBountyPopup 
              isAddingBounty={isAddingBounty} 
              title={commonTitle} 
              description={isAddBountyIssue(issue) ? issue.body : ''} 
              labels={commonLabels} 
              repository={commonRepo} 
              assignees={issue.assignees} 
              prRaise={issue.prRaised} 
              issueLink={commonUrl} 
              created={isAddBountyIssue(issue) ? issue.created_at : issue.createdAt} 
              updated={isAddBountyIssue(issue) ? issue.updated_at : issue.updatedAt} 
              status={issue.state} 
              latestComment={issue.activityLog} 
              issueId={isAddBountyIssue(issue) ? issue.id : issue.githubId} 
            />
           : <RemoveBountyPopup 
              bounty={!isAddBountyIssue(issue) ? issue.bounty : 0} 
              isAddingBounty={isAddingBounty} 
              title={commonTitle} 
              labels={commonLabels} 
              repository={commonRepo} 
              assignees={issue.assignees} 
              prRaise={issue.prRaised} 
              issueLink={commonUrl} 
              created={isAddBountyIssue(issue) ? issue.created_at : issue.createdAt} 
              updated={isAddBountyIssue(issue) ? issue.updated_at : issue.updatedAt} 
              status={issue.state} 
              latestComment={issue.activityLog} 
              // @ts-ignore
              issueId={isAddBountyIssue(issue) ? issue.id : issue.githubId} 
            />}
             </div>
        </div>
      
        <div className="flex flex-wrap gap-2 mb-4">
          {commonLabels != null && commonLabels.map((label: string) => (
            <span
              key={label}
              className="text-xs font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 px-2 py-0.5 rounded-full"
            >
              {label}
            </span>
          ))}
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