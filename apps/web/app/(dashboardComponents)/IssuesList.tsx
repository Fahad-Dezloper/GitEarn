"use client";
import { motion } from 'motion/react'
import Link from "next/link";
import { GithubIcon } from "@/components/ui/github";
import { LuExternalLink } from "react-icons/lu";
import { formatDate } from "@/lib/date";
import { ExampleSheetWithKeyboard } from "../components/SheetWithKeyboard/ExampleSheetWithKeyboard";


type Label = {
  name: string;
  color: string;
  description?: string | null;
};

type Issue = {
  id: number;
  title: string;
  state: string;
  html_url: string;
  created_at: string;
  body: string | null;
  number: number;
  labels: Label[];
};

type Repository = {
  id: number;
  name: string;
  issues: Issue[];
};

export default function IssuesList({
  issuesRepo,
  filters,
  loading
}: {
  issuesRepo: Repository[];
  filters: {
    search: string;
    repo: string;
    label: string;
    date: string;
  };
}) {
  const filteredIssues = issuesRepo
    .filter((repo) => (filters.repo ? repo.name === filters.repo : true))
    .flatMap((repo) =>
      repo.issues
        .filter((issue) => {
          const matchesSearch =
            filters.search === "" ||
            issue.title.toLowerCase().includes(filters.search.toLowerCase()) ||
            (issue.body ?? "")
              .toLowerCase()
              .includes(filters.search.toLowerCase());

          const matchesLabel =
            filters.label === "" ||
            issue.labels.some((label) => label.name === filters.label);

          const matchesDate =
            filters.date === "" ||
            new Date(issue.created_at).toISOString().split("T")[0] === filters.date;

          return matchesSearch && matchesLabel && matchesDate;
        })
        .map((issue) => ({
          ...issue,
          repoName: repo.name,
        }))
    )
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );


    if(loading){
      return <div>We are coming MFS</div>
    }


  if (!filteredIssues.length) {
    return <p className="text-muted-foreground">No matching issues found.</p>;
  }

  // console.log("issue List page", filteredIssues);


  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {filteredIssues.map((issue, index) => (
        <motion.div
        key={issue.title}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
        className="bg-white flex flex-col justify-between dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-5 shadow-sm hover:shadow-md transition-all"
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex flex-col gap-1">
            <p className="text-sm text-gray-500 dark:text-gray-400 font-mono">{issue.repoName}</p>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{issue.title}</h3>
          </div>
          <div className="relative">
             <ExampleSheetWithKeyboard title={issue.title} description={issue.body} labels={issue.labels} repository={issue.repoName} assignees={issue.assignees} prRaise={issue.prRaised} issueLink={issue.issueLink} created={issue.created_at} updated={issue.updated_at} status={issue.state} latestComment={issue.activityLog} issueId={issue.id}  />
          </div>
        </div>
      
        <div className="flex flex-wrap gap-2 mb-4">
          {issue.labels.map((label, i) => (
            <span
              key={i}
              className="text-xs font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 px-2 py-0.5 rounded-full"
            >
              {label.name}
            </span>
          ))}
        </div>
      
        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
          <span>#{issue.number} opened on{" "} <span className="underline">{formatDate(new Date(issue.created_at).toLocaleDateString())}</span></span>
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
  );
}
