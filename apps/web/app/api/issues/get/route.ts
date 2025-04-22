/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
// pages/api/issues/get.ts

import { Octokit } from '@octokit/rest';
import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import prisma from '@repo/db/client';
import axios from 'axios';

type Label = {
  name: string;
  color: string;
  description?: string | null;
};

type ActivityLogEntry = {
  type: "comment" | "status" | "commit";
  user: string;
  content?: string;
  from?: string;
  to?: string;
  date: string;
};

type IssueExtended = {
  id: number;
  title: string;
  state: string;
  html_url: string;
  created_at: string;
  updated_at: string;
  body: string | null;
  number: number;
  labels: Label[];
  repository: string;
  assignees: string[];
  prRaised: boolean;
  issueLink: string;
  latestComment: {
    user: string;
    comment: string;
    date: string;
  } | null;
  activityLog: ActivityLogEntry[];
};

type Repository = {
  id: number;
  name: string;
  html_url: string;
  description: string | null;
  fork: boolean;
  activity: number[];
  issues: IssueExtended[];
};

export async function GET(_request: Request) {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { accounts: true },
    });

    const token = user?.accounts[0]?.access_token;

    if (!token) {
      return NextResponse.json({ error: 'GitHub token is required' }, { status: 401 });
    }

    const userResponse = await axios.get("https://api.github.com/user", {
      headers: { Authorization: `token ${token}` },
    });

    const username = userResponse.data.login;

    if (!username || typeof username !== 'string') {
      return NextResponse.json({ error: 'Unable to fetch GitHub username' }, { status: 500 });
    }

    const octokit = new Octokit({ auth: token });

    const { data: repositories } = await octokit.repos.listForUser({
      username,
      per_page: 100,
    });

    const reposWithIssues: Repository[] = await Promise.all(
      repositories.map(async (repo) => {
        const issuesPromise = octokit.issues.listForRepo({
          owner: username,
          repo: repo.name,
          per_page: 100,
          state: 'all',
        });
        
        const activityPromise = !repo.fork
          ? octokit.repos.getCommitActivityStats({
              owner: username,
              repo: repo.name,
            })
          : Promise.resolve({ data: [] });

        const [issuesRes, activityRes] = await Promise.allSettled([
              issuesPromise,
              activityPromise,
        ]);

        const issues = issuesRes.status === 'fulfilled' ? issuesRes.value.data : [];
        const activity = activityRes.status === 'fulfilled' && Array.isArray(activityRes.value.data)
          ? activityRes.value.data.map(week => week.total)
          : [];

        const filteredIssues = issues.filter(issue => !issue.pull_request);

        const mappedIssues: IssueExtended[] = await Promise.all(filteredIssues.map(async (issue) => {
          // Get Assignees
          const assignees = issue.assignees?.map((a) => `@${a.login}`) || [];

          // Get comments (for latest comment)
          const commentsRes = await octokit.issues.listComments({
            owner: username,
            repo: repo.name,
            issue_number: issue.number,
            per_page: 100,
          });

          const comments = commentsRes.data;
          const latestComment = comments.length
            ? {
                user: `@${comments[comments.length - 1].user?.login}`,
                comment: comments[comments.length - 1].body || "",
                date: comments[comments.length - 1].created_at,
              }
            : null;

          // Get events (to track PR raised and status changes)
          const eventsRes = await octokit.issues.listEventsForTimeline({
            owner: username,
            repo: repo.name,
            issue_number: issue.number,
            per_page: 100,
          });

          const events = eventsRes.data;
          const prRaised = events.some((event: any) =>
            event.event === 'cross-referenced' &&
            event.source?.issue?.pull_request &&
            event.source?.type === 'issue'
          );

          // Build Activity Log
          const activityLog: ActivityLogEntry[] = [];

          // Add comment activity to log
          for (const comment of comments) {
            activityLog.push({
              type: "comment",
              user: `@${comment.user?.login}`,
              content: comment.body || "",
              date: comment.created_at,
            });
          }

          for (const event of events) {
            if (event.event === "closed" || event.event === "reopened") {
              activityLog.push({
                type: "status",
                from: event.event === "closed" ? "Open" : "Closed",
                to: event.event === "closed" ? "Closed" : "Open",
                user: `@${event.actor?.login}`,
                date: event.created_at,
              });
            }
            if (event.event === "referenced" && event.commit_id) {
              activityLog.push({
                type: "commit",
                user: `@${event.actor?.login}`,
                content: `${event.commit_id.substring(0, 7)} referenced this issue.`,
                date: event.created_at,
              });
            }
          }

          console.log("issue main details", issue);

          return {
            id: issue.id,
            title: issue.title,
            state: issue.state,
            html_url: issue.html_url,
            created_at: issue.created_at,
            updated_at: issue.updated_at,
            body: issue.body,
            number: issue.number,
            labels: (issue.labels || []).map(label => ({
              name: typeof label === 'string' ? label : label.name,
              color: typeof label === 'string' ? 'ffffff' : label.color,
              description: typeof label === 'string' ? null : label.description,
            })),
            repository: repo.name,
            assignees,
            prRaised,
            issueLink: issue.html_url,
            latestComment,
            activityLog,
          };
        }));

        // console.log("mapped issues", mappedIssues);
        // console.log("activity log issues", mappedIssues.activityLog);

        return {
          id: repo.id,
          name: repo.name,
          html_url: repo.html_url,
          description: repo.description,
          fork: repo.fork,
          activity,
          issues: mappedIssues,
        };
      })
    );

    return NextResponse.json(reposWithIssues, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching repositories and issues:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch repositories and issues' },
      { status: 500 }
    );
  }
}