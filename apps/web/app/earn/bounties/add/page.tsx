"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { GithubIcon } from "@/components/ui/github";
import IssueFilter from "@/app/(dashboardComponents)/IssueFilter";
import IssuesList from "@/app/(dashboardComponents)/IssuesList";

export default function Page() {
    const [issuesRepo, setIssuesRepo] = useState([]);
    const [loading, setLoading] = useState(false);
  
    const [filters, setFilters] = useState({
      search: "",
      repo: "",
      label: "",
      date: "",
    });
  
    useEffect(() => {
      async function getIssues() {
        try {
          setLoading(true);
          const res = await axios.get(`/api/issues/get`);
          setIssuesRepo(res.data);
        } catch (e) {
          console.error("Error while fetching:", e);
        } finally {
          setLoading(false);
        }
      }
  
      getIssues();
    }, []);
  
    // Flatten all labels from issues
    const allLabels = Array.from(
      new Set(
        issuesRepo.flatMap((r) =>
          r.issues.flatMap((issue) =>
            issue.labels.map((label) => label.name)
          )
        )
      )
    );
  
    return (
      <div className="flex flex-col gap-6 py-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-sora font-semibold flex gap-2 items-center">
            Add Bounty to your <GithubIcon size={32} /> issues
          </h1>
          <p className="text-muted-foreground">
            Add Bounty to your GitHub issues and get them solved fast
          </p>
        </div>
  
        <IssueFilter
          repositories={issuesRepo.map((r) => r.name)}
          labels={allLabels}
          filters={filters}
          onFilterChange={setFilters}
        />
  
        <IssuesList issuesRepo={issuesRepo} filters={filters} />
      </div>
    );
  }
  
