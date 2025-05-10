/* eslint-disable @typescript-eslint/ban-ts-comment */
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
  userAvatar: string;
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

    // console.log("user found here", user);

    const token = user?.accounts[0]?.access_token;
    // console.log("token for verify", token);
    // const token = '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';

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

        // @ts-ignore
        const mappedIssues: IssueExtended[] = await Promise.all(filteredIssues.map(async (issue) => {
          // console.log("here assigness", issue.assignees);
          const assignees = issue.assignees || [];

          const commentsRes = await octokit.issues.listComments({
            owner: username,
            repo: repo.name,
            issue_number: issue.number,
            per_page: 100,
          });

          const comments = commentsRes.data;
          // console.log("comments here", comments[comments.length - 1].user?.avatar_url);
          const latestComment = comments.length
            ? {
                user: comments[comments.length - 1].user,
                comment: comments[comments.length - 1].body || "",
                userAvatar: comments[comments.length - 1].user?.avatar_url || "",
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

          const activityLog: ActivityLogEntry[] = [];

          for (const comment of comments) {
            // console.log("found" , comment.user.avatar_url)
            activityLog.push({
              type: "comment",
              user: comment.user?.login || 'unknown',
              userAvatar: comment.user?.avatar_url || "",
              content: comment.body || "",
              date: comment.created_at,
            });
            // console.log("added" , activityLog)
          }

          for (const event of events) {
            if (event.event === "closed" || event.event === "reopened") {
              activityLog.push({
                type: "status",
                from: event.event === "closed" ? "Open" : "Closed",
                to: event.event === "closed" ? "Closed" : "Open",
                user: 'actor' in event && event.actor ? `@${event.actor.login}` : 'unknown',
                date: 'created_at' in event ? event.created_at : ('committer' in event && event.committer?.date) ? event.committer.date : new Date().toISOString(),
                userAvatar: 'actor' in event && event.actor ? event.actor.avatar_url : ''
              });
            }
            if (event.event === "referenced" && 'commit_id' in event && event.commit_id) {
              activityLog.push({
                type: "commit",
                user: `@${('actor' in event && event.actor ? event.actor.login : 'unknown')}`,
                content: `${event.commit_id.substring(0, 7)} referenced this issue.`,
                date: ('created_at' in event ? event.created_at : new Date().toISOString()),
                userAvatar: ('actor' in event && event.actor ? event.actor.avatar_url : '')
              });
            }
          }

          // console.log("final issue here", activityLog);

          return {
            id: issue.id,
            title: issue.title,
            state: issue.state,
            html_url: issue.html_url,
            created_at: issue.created_at,
            updated_at: issue.updated_at,
            body: issue.body ?? null,
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