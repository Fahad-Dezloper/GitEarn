/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
// pages/api/issues/get.ts

import { Octokit } from '@octokit/rest';
import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import prisma from '@repo/db/client';
import axios from 'axios';

// Define response types
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
  html_url: string;
  description: string | null;
  fork: boolean;
  activity: number[]; // Weekly commits (last 52 weeks)
  issues: Issue[];
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
        const [issuesRes, activityRes] = await Promise.allSettled([
          octokit.issues.listForRepo({
            owner: username,
            repo: repo.name,
            per_page: 100,
            state: 'all',
          }),
          octokit.repos.getCommitActivityStats({
            owner: username,
            repo: repo.name,
          }),
        ]);

        const issues = issuesRes.status === 'fulfilled' ? issuesRes.value.data : [];
        const activity = activityRes.status === 'fulfilled' && Array.isArray(activityRes.value.data)
          ? activityRes.value.data.map(week => week.total)
          : [];

        const filteredIssues = issues.filter(issue => !issue.pull_request);

        const mappedIssues: Issue[] = filteredIssues.map(issue => ({
          id: issue.id,
          title: issue.title,
          state: issue.state,
          html_url: issue.html_url,
          created_at: issue.created_at,
          body: issue.body,
          number: issue.number,
          labels: (issue.labels || []).map(label => ({
            name: typeof label === 'string' ? label : label.name,
            color: typeof label === 'string' ? 'ffffff' : label.color,
            description: typeof label === 'string' ? null : label.description,
          })),
        }));

        return {
          id: repo.id,
          name: repo.name,
          html_url: repo.html_url,
          description: repo.description,
          fork: repo.fork,
          activity, // weekly commits
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