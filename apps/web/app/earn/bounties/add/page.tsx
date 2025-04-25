"use client";
import { useState, useEffect } from "react";
import { GithubIcon } from "@/components/ui/github";
import IssueFilter from "@/app/(dashboardComponents)/IssueFilter";
import IssuesList from "@/app/(dashboardComponents)/IssuesList";
import { useBountyDetails } from "@/app/context/BountyContextProvider";
import { Button } from "@/components/ui/button"; // Ensure Button is imported

export default function Page() {
  const [loading, setLoading] = useState(false);
  const { issuesRepo, userBountyIssue } = useBountyDetails();

  const [filteredIssues, setFilteredIssues] = useState([]);
  const [filters, setFilters] = useState({
    search: "",
    repo: "",
    label: "",
    date: "",
  });

  const [isAddingBounty, setIsAddingBounty] = useState(true);

  useEffect(() => {
    const applyFilters = () => {
      const bountyIds = new Set(userBountyIssue.map((b) => b.githubId));
      const bountyUrls = new Set(userBountyIssue.map((b) => b.htmlUrl));

      let allIssues = [];

      if (isAddingBounty) {
        allIssues = issuesRepo.flatMap((repo) =>
          repo.issues
            .filter(
              (issue) =>
                !bountyIds.has(issue.user.id) && !bountyUrls.has(issue.html_url)
            )
            .map((issue) => ({
              ...issue,
              repoName: repo.name,
            }))
        );
      } else {
        allIssues = userBountyIssue.map((bounty) => ({
          ...bounty,
          repoName: bounty.repo,
        }));
      }

      if (filters.repo) {
        allIssues = allIssues.filter((issue) => issue.repoName === filters.repo);
      }

      if (filters.label) {
        allIssues = allIssues.filter((issue) =>
          issue.labels.some((label) =>
            label.name.toLowerCase().includes(filters.label.toLowerCase())
          )
        );
      }

      if (filters.search) {
        allIssues = allIssues.filter((issue) =>
          issue.title.toLowerCase().includes(filters.search.toLowerCase())
        );
      }

      setFilteredIssues(allIssues);
    };

    applyFilters();
  }, [filters, issuesRepo, userBountyIssue, isAddingBounty]);

  const allLabels = Array.from(
    new Set(
      issuesRepo.flatMap((r) =>
        r.issues.flatMap((issue) => issue.labels.map((label) => label.name))
      )
    )
  );

  return (
    <div className="flex flex-col gap-6 py-4">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-sora font-semibold flex gap-2 items-center">
          {isAddingBounty ? "Add Bounty" : "Manage Bounty"} to your <GithubIcon size={32} /> issues
        </h1>
        <p className="text-muted-foreground">
          {isAddingBounty
            ? "Add Bounty to your GitHub issues and get them solved fast"
            : "Manage the bounties on your GitHub issues"}
        </p>
      </div>

      {/* Toggle Button */}
      <div className="flex gap-4 mb-6">
        <Button
          onClick={() => setIsAddingBounty(true)}
          variant={isAddingBounty ? "default" : "outline"}
        >
          Add Bounty
        </Button>
        <Button
          onClick={() => setIsAddingBounty(false)}
          variant={!isAddingBounty ? "default" : "outline"}
        >
          Manage Bounty
        </Button>
      </div>

      <IssueFilter
        repositories={issuesRepo.map((r) => r.name)}
        labels={allLabels}
        filters={filters}
        handleChange={setFilters}
      />

      <IssuesList issues={filteredIssues} loading={loading} />
    </div>
  );
}
