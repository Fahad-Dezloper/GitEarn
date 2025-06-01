/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
// pages/api/issues/get.ts

import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import prisma from '@repo/db/client';
import { getValidInstallationToken } from '@/lib/github/getValidInstallationToken';
import { Octokit } from "@octokit/rest";

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
    // console.log("sesssion here", session);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }


    const installationToken = await getValidInstallationToken(session?.user?.email);
    console.log("installation token new", installationToken);

    if (!installationToken) {
      return NextResponse.json({ error: 'GitHub installation token is required' }, { status: 401 });
    }

    const octokit = new Octokit({
      auth: installationToken,
    });


    // ✅ Valid for GitHub App installation token
      const { data: reposResponse } = await octokit.apps.listReposAccessibleToInstallation();

      const repositories = reposResponse.repositories;
      console.log("issues", repositories);

      repositories.forEach(repo => {
        console.log(repo.name);
      });

    const reposWithIssues: Repository[] = await Promise.all(
      repositories.map(async (repo) => {
        let activity: number[] = [];
        
        if (!repo.fork) {
          try {
            const activityRes = await octokit.repos.getCommitActivityStats({
              owner: repo.owner.login,
              repo: repo.name,
            });
            activity = Array.isArray(activityRes.data) 
              ? activityRes.data.map(week => week.total)
              : [];
          } catch (error) {
            console.error(`Error fetching activity for ${repo.name}:`, error);
          }
        }

        const issuesRes = await octokit.issues.listForRepo({
          owner: repo.owner.login,
          repo: repo.name,
          per_page: 30,
          state: 'all',
          sort: 'updated',
          direction: 'desc',
        });

        const filteredIssues = issuesRes.data.filter(issue => !issue.pull_request);
        
        // @ts-ignore
        const mappedIssues: IssueExtended[] = await Promise.all(
          filteredIssues.map(async (issue) => {
            const assignees = issue.assignees || [];

            const commentsRes = await octokit.issues.listComments({
              owner: repo.owner.login,
              repo: repo.name,
              issue_number: issue.number,
              per_page: 10,
              sort: 'updated',
              direction: 'desc',
            });

            const comments = commentsRes.data;
            const latestComment = comments.length
              ? {
                  user: comments[0].user,
                  comment: comments[0].body || "",
                  userAvatar: comments[0].user?.avatar_url || "",
                  date: comments[0].created_at,
                }
              : null;

            const eventsRes = await octokit.issues.listEventsForTimeline({
              owner: repo.owner.login,
              repo: repo.name,
              issue_number: issue.number,
              per_page: 10,
            });

            const events = eventsRes.data;
            const prRaised = events.some((event: any) =>
              event.event === 'cross-referenced' &&
              event.source?.issue?.pull_request &&
              event.source?.type === 'issue'
            );

            const activityLog: ActivityLogEntry[] = [];

            const recentComments = comments.slice(0, 5);
            const recentEvents = events.slice(0, 5);

            for (const comment of recentComments) {
              activityLog.push({
                type: "comment",
                user: comment.user?.login || 'unknown',
                userAvatar: comment.user?.avatar_url || "",
                content: comment.body || "",
                date: comment.created_at,
              });
            }

            for (const event of recentEvents) {
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
                name: typeof label === 'string' ? label : label.name || '',
                color: typeof label === 'string' ? 'ffffff' : label.color || '',
                description: typeof label === 'string' ? null : label.description,
              })),
              repository: repo.name,
              assignees: assignees.map(assignee => assignee.login),
              prRaised,
              issueLink: issue.html_url,
              latestComment,
              activityLog,
            };
          })
        );

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

    console.log("repo with issues", reposWithIssues);

    return NextResponse.json(reposWithIssues, { status: 200 });
  } catch (error) {
    console.error('Error fetching repositories and issues:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch repositories and issues' },
      { status: 500 }
    );
  }
}