/* eslint-disable @typescript-eslint/no-explicit-any */
import prisma from '@repo/db/client';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { Octokit } from '@octokit/rest';

function extractGitHubIssueInfo(url: string) {
  const match = url.match(/github\.com\/([^/]+)\/([^/]+)\/issues\/(\d+)/);
  if (!match) throw new Error("Invalid GitHub issue URL");
  const [, owner, repo, issue_number] = match;
  return { owner, repo, issue_number: Number(issue_number) };   
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession();
    const body = await req.json();
    const { issueId, issueLink } = body;

    const user = await prisma.user.findFirst({
      where: {
        email: session?.user?.email || undefined
      },
      include: { accounts: true },
    });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const token = user.accounts[0]?.access_token;

    if (!token) {
      return NextResponse.json({ error: 'GitHub token is required' }, { status: 401 });
    }

    const octokit = new Octokit({ auth: token });

    const bounty = await prisma.bountyIssues.findFirst({
      where: {
        githubId: issueId,
        htmlUrl: issueLink,
      },
    });


    if (!bounty) {
      return NextResponse.json({ message: 'Bounty not found for this issue' }, { status: 404 });
    }


    await prisma.bountyIssues.delete({
      where: {
        id: bounty.id,
      },
    });

    const { owner, repo, issue_number } = extractGitHubIssueInfo(issueLink);

    await octokit.issues.createComment({
      owner,
      repo,
      issue_number,
      body: `❌ **$${bounty.bounty} bounty removed** from this issue via GitEarn.`,
    });

    const labelsToRemove = [`💎 Bounty`, `$${bounty.bounty}`];

    for (const label of labelsToRemove) {
      try {
        await octokit.issues.removeLabel({
          owner,
          repo,
          issue_number,
          name: label,
        });
      } catch (err: any) {
        if (err.status !== 404) throw err;
      }
    }

    return NextResponse.json({ message: 'Bounty removed successfully' }, { status: 200 });

  } catch (e) {
    console.log("Error while removing the bounty or updating GitHub:", e);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
