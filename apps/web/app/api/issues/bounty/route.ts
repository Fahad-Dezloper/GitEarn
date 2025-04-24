import prisma from "@repo/db/client";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

function safeJson(obj: any) {
  return JSON.parse(
    JSON.stringify(obj, (_, value) =>
      typeof value === "bigint" ? value.toString() : value
    )
  );
}

async function fetchGitHubIssueData(htmlUrl: string) {
  const match = htmlUrl.match(/github\.com\/([^/]+)\/([^/]+)\/issues\/(\d+)/);
  if (!match) {
    return { title: "Invalid URL", repo: "", tags: [] };
  }

  const [_, owner, repo, issue_number] = match;

  try {
    const res = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/issues/${issue_number}`,
      {
        headers: {
          Accept: "application/vnd.github.v3+json",
          Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        },
      }
    );

    if (!res.ok) throw new Error("GitHub fetch failed");

    const data = await res.json();

    return {
      title: data.title,
      repo: `${owner}/${repo}`,
      tags: data.labels.map((label: any) => label.name),
    };
  } catch (err) {
    console.error("GitHub issue fetch error", err);
    return { title: "Unavailable", repo: `${owner}/${repo}`, tags: [] };
  }
}

export async function GET() {
  const session = await getServerSession();

  if (!session) {
    return NextResponse.json({ message: "Unauthorized Request" }, { status: 401 });
  }

  try {
    const issues = await prisma.bountyIssues.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    const enrichedIssues = await Promise.all(
      issues.map(async (issue) => {
        const meta = await fetchGitHubIssueData(issue.htmlUrl);
        return {
          ...issue,
          title: meta.title,
          repo: meta.repo,
          tags: meta.tags,
          posted: new Date(issue.createdAt).toLocaleDateString(),
        };
      })
    );

    return NextResponse.json(
      {
        message: "Bounty issues fetched successfully",
        BountyIssues: safeJson(enrichedIssues),
      },
      { status: 200 }
    );
  } catch (e) {
    console.error("Error fetching bounty issues", e);
    return NextResponse.json({ message: "Error fetching bounty issues" }, { status: 500 });
  }
}