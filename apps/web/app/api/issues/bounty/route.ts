/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import prisma from "@repo/db/client";
import { getServerSession } from "next-auth";
import { Session } from "next-auth";
import { NextResponse } from "next/server";

function safeJson(obj: any) {
  return JSON.parse(
    JSON.stringify(obj, (_, value) =>
      typeof value === "bigint" ? value.toString() : value
    )
  );
}

async function getGitHubAccessToken(userEmail: string) {
  const account = await prisma.user.findFirst({
    where: {
      email: userEmail,
    },
    include: {
      accounts: true
    }
  });

  const githubAccount = account?.accounts.find(
    (acc) => acc.provider === "github"
  );

  if(githubAccount?.installationToken !== undefined || null){
    return githubAccount?.installationToken;
  } else {
    return githubAccount?.access_token;
  }

}

async function fetchRepoLanguages(owner: string, repo: string, accessToken: string) {
  try {
    const res = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/languages`,
      {
        headers: {
          Accept: "application/vnd.github.v3+json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!res.ok) throw new Error("Failed to fetch repo languages");

    const languages  = await res.json();

    const colorRes = await fetch(
      "https://raw.githubusercontent.com/ozh/github-colors/master/colors.json"
    );

    if (!colorRes.ok) throw new Error("Failed to fetch language colors");

    const colorData = await colorRes.json();

    const result = Object.keys(languages).map((lang) => ({
      name: lang,
      color: colorData[lang]?.color || "#000000",
    }));
    
    return result;
  } catch (err) {
    console.error("GitHub languages fetch error", err);
    return [];
  }
}

async function fetchGitHubIssueData(htmlUrl: string, accessToken: string) {
  const match = htmlUrl.match(/github\.com\/([^/]+)\/([^/]+)\/issues\/(\d+)/);
  if (!match) {
    return { title: "Invalid URL", repo: "", tags: [], languages: [] };
  }

  const [_, owner, repo, issue_number] = match;

  try {
    const [issueRes, languages] = await Promise.all([
      fetch(
        `https://api.github.com/repos/${owner}/${repo}/issues/${issue_number}`,
        {
          headers: {
            Accept: "application/vnd.github.v3+json",
          Authorization: `Bearer ${accessToken}`,
          },
        }
      ),
      fetchRepoLanguages(owner, repo, accessToken),
    ]);

    if (!issueRes.ok) throw new Error("GitHub issue fetch failed");

    const data = await issueRes.json();

    return {
      title: data.title,
      repo: `${owner}/${repo}`,
      tags: data.labels.map((label: any) => label.name),
      languages,
    };
  } catch (err) {
    console.error("GitHub issue fetch error", err);
    return { title: "Unavailable", repo: `${owner}/${repo}`, tags: [], languages: [] };
  }
}

export async function GET() {
  const session = await getServerSession() as Session & { user: { id: string, email: string } };
  if (!session?.user?.email) {
    return NextResponse.json({ message: "Unauthorized Request" }, { status: 401 });
  }

  try {
    const accessToken = await getGitHubAccessToken(session?.user?.email || "");
    
    if (!accessToken) {
      return NextResponse.json({ message: "GitHub access token not found" }, { status: 401 });
    }

    const issues = await prisma.bountyIssues.findMany({
      where: {
        status : {
          in: ['ACTIVE', 'CANCELLING'],
        }
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const enrichedIssues = await Promise.all(
      issues.map(async (issue: any) => {
        const meta = await fetchGitHubIssueData(issue.htmlUrl, accessToken);
        return {
          ...issue,
          title: meta.title,
          repo: meta.repo,
          tags: meta.tags,
          technologies: meta.languages,
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