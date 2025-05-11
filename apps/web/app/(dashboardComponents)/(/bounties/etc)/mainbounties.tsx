/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useState, useEffect, useMemo } from "react";
import { GithubIcon } from "@/components/ui/github";
import IssueFilter from "@/app/(dashboardComponents)/IssueFilter"; 
import IssuesList from "@/app/(dashboardComponents)/IssuesList"; 
import { useBountyDetails } from "@/app/context/BountyContextProvider";
import { Button } from "@/components/ui/button";
import { useWallet } from "@solana/wallet-adapter-react";

export default function Mainbounties() {
  const [loading, setLoading] = useState(false);
  const { issuesRepo, userBountyIssue } = useBountyDetails();
  const { publicKey, signMessage } = useWallet();
// console.log("main bounty here page add");
  
  useEffect(() => {
    const signAndSend = async () => {
      if (!publicKey || !signMessage) return;

      const storageKey = `gitEarn-signature-${publicKey.toBase58()}`;

      // Check if signature is already stored
      const existingSignature = localStorage.getItem(storageKey);
      if (existingSignature) return;

      try {
        const message = new TextEncoder().encode("Sign into GitEarn");
        const signature = await signMessage(message);
        
        // Store signature
        localStorage.setItem(storageKey, JSON.stringify([...signature]));
        // console.log("Signature stored:", signature);
      } catch (err) {
        console.error("Signature failed:", err);
      }
    };

    signAndSend();
  }, [publicKey, signMessage]);
  
  const [isAddingBounty, setIsAddingBounty] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);
  const [selectedRepo, setSelectedRepo] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined } | undefined>(undefined);

  const allIssues = useMemo(() => {
    return issuesRepo.flatMap(repo =>
      repo.issues.map((issue: { labels: any[]; }) => ({
        ...issue,
        repositoryName: repo.name,
        repositoryFullName: `${repo.html_url.split('/')[3]}/${repo.name}`,
        labelNames: issue.labels.map(label => label.name),
      }))
    );
  }, [issuesRepo]);

  const bountiedIssueIds = useMemo(() => {
    return new Set(userBountyIssue.map(bounty => bounty.githubId));
  }, [userBountyIssue]);

  const addBountyIssues = useMemo(() => {
    return allIssues.filter(issue => !bountiedIssueIds.has(String(issue.id)));
  }, [allIssues, bountiedIssueIds]);

  const manageBountyIssues = useMemo(() => {
      return userBountyIssue.map(issue => ({
          ...issue,
          createdAtDate: new Date(issue.createdAt),
      }));
  }, [userBountyIssue]);

  const availableRepositories = useMemo(() => {
    const repos = isAddingBounty
      ? allIssues.map(issue => issue.repositoryFullName)
      : manageBountyIssues.map(issue => issue.repo);
    return [...new Set(repos)];
  }, [allIssues, manageBountyIssues, isAddingBounty]);

  const availableLabels = useMemo(() => {
    const labels = isAddingBounty
      ? allIssues.flatMap(issue => issue.labelNames)
      : manageBountyIssues.flatMap(issue => issue.tags);
    return [...new Set(labels)].sort();
  }, [allIssues, manageBountyIssues, isAddingBounty]);

  const filteredIssues = useMemo(() => {
    let issuesToFilter = isAddingBounty ? addBountyIssues : manageBountyIssues;

    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      issuesToFilter = issuesToFilter.filter(issue =>
        issue.title.toLowerCase().includes(lowerSearchTerm) ||
        (issue.body && issue.body.toLowerCase().includes(lowerSearchTerm))
      );
    }

    if (selectedRepo) {
       issuesToFilter = issuesToFilter.filter(issue =>
         (isAddingBounty ? issue.repositoryFullName : issue.repo) === selectedRepo
       );
    }

    if (selectedLabels.length > 0) {
      issuesToFilter = issuesToFilter.filter(issue => {
        const issueLabels = isAddingBounty ? issue.labelNames : issue.tags;
        return selectedLabels.every(label => issueLabels.includes(label));
      });
    }

    if (dateRange?.from || dateRange?.to) {
       const fromDate = dateRange.from;
       const toDate = dateRange.to ? new Date(dateRange.to.setHours(23, 59, 59, 999)) : undefined;

       issuesToFilter = issuesToFilter.filter(issue => {
           const issueDate = isAddingBounty ? new Date(issue.created_at) : issue.createdAtDate;

           const isAfterFrom = fromDate ? issueDate >= fromDate : true;
           const isBeforeTo = toDate ? issueDate <= toDate : true;
           return isAfterFrom && isBeforeTo;
       });
    }

    return issuesToFilter;
  }, [
    isAddingBounty,
    addBountyIssues,
    manageBountyIssues,
    searchTerm,
    selectedRepo,
    selectedLabels,
    dateRange
  ]);

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedLabels([]);
    setSelectedRepo(null);
    setDateRange(undefined);
  };

  const handleFilterChange = (filters: {
    search?: string;
    labels?: string[];
    repository?: string | null;
    dates?: { from: Date | undefined; to?: Date | undefined } | undefined;
  }) => {
    if (filters.search !== undefined) setSearchTerm(filters.search);
    if (filters.labels !== undefined) setSelectedLabels(filters.labels);
    if (filters.repository !== undefined) setSelectedRepo(filters.repository);
    if (filters.dates !== undefined) setDateRange({ from: filters.dates.from, to: filters.dates.to || undefined });
  };

  return (
    <div className="flex flex-col gap-4 md:gap-6 py-3 md:py-4">
      <div className="flex flex-col gap-1 md:gap-2">
        <h1 className="text-2xl md:text-4xl font-sora font-semibold flex flex-wrap gap-2 items-center">
          {isAddingBounty ? "Add Bounty" : "Manage Bounty"} to your{" "}
          <GithubIcon size={24} className="" /> issues
        </h1>
        <p className="text-sm md:text-base text-muted-foreground">
          {isAddingBounty
            ? "Select GitHub issues to add a bounty and get them solved fast."
            : "View and manage the bounties you've placed on GitHub issues."}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-2 md:gap-4 mb-2">
        <Button
          onClick={() => {
              setIsAddingBounty(true);
              resetFilters();
          }}
          variant={isAddingBounty ? "default" : "outline"}
          size="sm"
          className="w-full sm:w-auto"
        >
          Add Bounty
        </Button>
        <Button
          onClick={() => {
              setIsAddingBounty(false);
              resetFilters();
          }}
          variant={!isAddingBounty ? "default" : "outline"}
          size="sm"
          className="w-full sm:w-auto"
        >
          Manage Bounty
        </Button>
      </div>

      <IssueFilter
          repositories={availableRepositories}
          labels={availableLabels}
          onFilterChange={handleFilterChange} 
          onResetFilters={resetFilters}
          currentFilters={{
              search: searchTerm,
              selectedLabels: selectedLabels,
              selectedRepo: selectedRepo,
              dateRange: dateRange
          }}
          key={isAddingBounty ? 'add-filter' : 'manage-filter'} 
      />

      {loading ? (
        <p>Loading issues...</p>
      ) : (
        <IssuesList
          issues={filteredIssues}
          isAddingBounty={isAddingBounty}
        />
      )}
    </div>
  );
}