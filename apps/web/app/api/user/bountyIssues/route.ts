/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
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

async function getUserByGitHubId(githubId: string){
  // console.log("github id", githubId);
  const res = await prisma.account.findUnique({
    where: {
      provider_providerAccountId: {
        provider: 'github',
        providerAccountId: githubId
      }
    },
    include: {
      user: {
        include: {
          wallet: true
        }
      }
    }
  });


  if(!res){
    return;
  }

  return res?.user?.wallet?.publicKey;
}

async function fetchGitHubIssueData(htmlUrl: string) {
  const match = htmlUrl.match(/github\.com\/([^/]+)\/([^/]+)\/issues\/(\d+)/);
  if (!match) {
    return null;
  }

  // @ts-ignore
  const [_, owner, repo, issue_number] = match;
  const headers = {
    Accept: "application/vnd.github.v3+json",
    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
  };

  try {
    const issueRes = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/issues/${issue_number}`,
      { headers }
    );

    if (!issueRes.ok) throw new Error("GitHub issue fetch failed");
    const issueData = await issueRes.json();
    // console.log("issue data final is here", issueData);


    const commentsRes = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/issues/${issue_number}/comments`,
      { headers }
    );
    
    if (!commentsRes.ok) throw new Error("GitHub comments fetch failed");
    const commentsData = await commentsRes.json();

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
    
    const prRaised = timelineData.some((event: any) => 
      event.event === "cross-referenced" && event.source?.issue?.pull_request
    );

    const activityLog = commentsData.map((comment: any) => ({
      type: "comment",
      user: comment.user,
      content: comment.body,
      date: comment.created_at
    }));


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

    // console.log("issue data", issueData.assignees);
    const enrichedAssignees = await Promise.all(
      (issueData.assignees || []).map(async (assignee: any) => {
        const githubId = assignee.id.toString();

        const userFromDb = await getUserByGitHubId(githubId);

        return {
          ...assignee,
          githubId,
          walletAddress: userFromDb || null,
          exists: !!userFromDb,
        };
      })
    );

    // console.log("enrichedAssigness",  enrichedAssignees);

    return {
      id: issueData.id,
      title: issueData.title,
      state: issueData.state,
      html_url: issueData.html_url,
      created_at: issueData.created_at,
      updated_at: issueData.updated_at,
      body: issueData.body,
      number: issueData.number,
      labels: (issueData.labels || []).map((label: { name: any; color: any; description: any; }) => ({
        name: typeof label === 'string' ? label : label.name,
        color: typeof label === 'string' ? 'ffffff' : label.color,
        description: typeof label === 'string' ? null : label.description,
      })),
      repository: repo,
      assignees: enrichedAssignees || [],
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

    const userid = await prisma.user.findUnique({
      where: { 
        email: session.user.email 
      },
    });

    if(!userid){
      return NextResponse.json({message: "Unauthorized request"}, {status: 500})
    }

    const issues = await prisma.bountyIssues.findMany({
      where: {
        userId: userid.id,
        status: {
          in: ['ACTIVE', 'CANCELLING']
        }
      }, include: {
        transactions: true
      }
    })

    console.log("raw user issues", JSON.stringify(issues, (key, value) =>
      typeof value === 'bigint' ? value.toString() : value, 2));

    // const issues = Rawissues.filter(issue => {
    //   const statuses = issue.transactions.map(tx => tx.status);
    
    //   const hasAllowedStatus = statuses.includes('confirmed') || statuses.includes('canceled_pending');
    //   const hasDisallowedStatus = statuses.includes('pending') || statuses.includes('canceled_confirmed');
    
    //   return hasAllowedStatus && !hasDisallowedStatus;
    // });
    
    console.log("filtered issues", issues);

    if (!issues) {
      return NextResponse.json({ 
        message: "No issues found", 
        UsersBountyIssues: [] 
      }, { status: 200 });
    }

    const enrichedIssues = await Promise.all(
      issues.map(async (issue) => {
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

    const validIssues = safeJson(enrichedIssues.filter(Boolean));
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