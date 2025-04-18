"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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

  if (!filteredIssues.length) {
    return <p className="text-muted-foreground">No matching issues found.</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {filteredIssues.map((issue) => (
        <Card key={issue.id} className="bg-muted/30 hover:shadow-md transition">
          <CardHeader>
            <CardTitle className="text-base">{issue.title}</CardTitle>
            <div className="flex flex-wrap gap-2 mt-2">
              {issue.labels.map((label) => (
                <Badge
                  key={label.name}
                  style={{ backgroundColor: `#${label.color}` }}
                >
                  {label.name}
                </Badge>
              ))}
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            {issue.body && (
              <p className="text-sm text-muted-foreground line-clamp-3">
                {issue.body}
              </p>
            )}
            <div className="text-xs text-gray-500">
              #{issue.number} opened on{" "}
              {new Date(issue.created_at).toLocaleDateString()} | Repo:{" "}
              {issue.repoName}
            </div>
            <div className="flex justify-between items-center mt-2">
              <a
                href={issue.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 underline"
              >
                View on GitHub
              </a>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="default" size="sm">
                    Add Bounty
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Bounty to Issue</DialogTitle>
                  </DialogHeader>
                  <p className="text-sm text-muted-foreground mb-2">
                    You're about to add a bounty to <strong>{issue.title}</strong> in{" "}
                    <code>{issue.repoName}</code>
                  </p>
                  <div className="text-muted-foreground">[ Add your form here ]</div>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
