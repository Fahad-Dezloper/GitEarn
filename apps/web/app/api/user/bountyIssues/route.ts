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
    return null;
  }

  const [_, owner, repo, issue_number] = match;
  const headers = {
    Accept: "application/vnd.github.v3+json",
    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
  };

  try {
    // Fetch issue details
    const issueRes = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/issues/${issue_number}`,
      { headers }
    );

    if (!issueRes.ok) throw new Error("GitHub issue fetch failed");
    const issueData = await issueRes.json();

    // Fetch comments
    const commentsRes = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/issues/${issue_number}/comments`,
      { headers }
    );
    
    if (!commentsRes.ok) throw new Error("GitHub comments fetch failed");
    const commentsData = await commentsRes.json();

    // Fetch pull requests associated with the issue
    const prRes = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/issues/${issue_number}/timeline`,
      { 
        headers: {
          ...headers,
          Accept: "application/vnd.github.mockingbird-preview+json"
        }
      }
    );
    
    const timelineData = prRes.ok ? await prRes.json() : [];
    
    // Check if there's a PR linked to this issue
    const prRaised = timelineData.some((event: any) => 
      event.event === "cross-referenced" && event.source?.issue?.pull_request
    );

    // Build activity log from comments
    console.log("comments data", commentsData);
    const activityLog = commentsData.map((comment: any) => ({
      type: "comment",
      user: comment.user,
      content: comment.body,
      date: comment.created_at
    }));

    // Find the latest comment
    let latestComment = null;
    if (commentsData.length > 0) {
      const mostRecent = commentsData.reduce((latest: any, current: any) => 
        new Date(latest.created_at) > new Date(current.created_at) ? latest : current
      );
      
      latestComment = {
        user: mostRecent.user,
        comment: mostRecent.body,
        date: mostRecent.created_at
      };
    }

    return {
      id: issueData.id,
      title: issueData.title,
      state: issueData.state,
      html_url: issueData.html_url,
      created_at: issueData.created_at,
      updated_at: issueData.updated_at,
      body: issueData.body,
      number: issueData.number,
      labels: (issueData.labels || []).map(label => ({
        name: typeof label === 'string' ? label : label.name,
        color: typeof label === 'string' ? 'ffffff' : label.color,
        description: typeof label === 'string' ? null : label.description,
      })),
      repository: repo,
      assignees: issueData.assignees || [],
      prRaised,
      issueLink: issueData.html_url,
      latestComment,
      activityLog
    };
  } catch (err) {
    console.error("GitHub issue fetch error", err);
    return null;
  }
}

export async function GET() {
  try {
    const session = await getServerSession();

    if (!session) {
      return NextResponse.json({ message: "Unauthorized Request" }, { status: 401 });
    }
  
    if (!session.user?.email) {
      return NextResponse.json({ message: "No user email found" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { issue: true },
    });

    if (!user || !user.issue) {
      return NextResponse.json({ 
        message: "No issues found", 
        UsersBountyIssues: [] 
      }, { status: 200 });
    }

    const enrichedIssues = await Promise.all(
      user.issue.map(async (issue) => {
        const enrichedData = await fetchGitHubIssueData(issue.htmlUrl);
        if (!enrichedData) {
          return null;
        }
        
        return {
          ...issue,
          ...enrichedData,
          posted: new Date(issue.createdAt).toLocaleDateString()
        };
      })
    );

    // Filter out any null values and convert BigInt to strings
    const validIssues = safeJson(enrichedIssues.filter(Boolean));
    // console.log("valid Issues", validIssues);
    return NextResponse.json(
      {
        message: "Bounty issues fetched successfully",
        UsersBountyIssues: validIssues,
      },
      { status: 200 }
    );
  } catch (e) {
    console.error("Error fetching bounty issues", e);
    return NextResponse.json({ message: "Error fetching bounty issues" }, { status: 500 });
  }
}