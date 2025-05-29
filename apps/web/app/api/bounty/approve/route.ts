/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Octokit } from "@octokit/rest";
import prisma from "@repo/db/client";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { getInstallationOctokit } from '@/lib/(GitEarnBotComments)/AddBountyComment';

function extractGitHubIssueInfo(url: string) {
    const match = url.match(/github\.com\/([^/]+)\/([^/]+)\/issues\/(\d+)/);
    if (!match) throw new Error("Invalid GitHub issue URL");
    const [, owner, repo, issue_number] = match;
    return { owner, repo, issue_number: Number(issue_number) };   
  }

export async function POST(req: NextRequest){
    try{
        const session = await getServerSession();
        const body = await req.json();
        const {issueId, issueLink, contributorId, contributorUserName} = body;

        // const confirmTransaction = await confirmTxt(signature, from, to)

        const user = await prisma.user.findFirst({
            where: {
                email: session?.user?.email || undefined
            }, include : {
                accounts: true
            }
        });

        if(!user){
            return NextResponse.json({message: 'User not found'}, {status: 404});
        }

        const token = user.accounts[0]?.access_token;

        if (!token) {
          return NextResponse.json({ error: 'GitHub token is required' }, { status: 401 });
        }
    
    
        const bounty = await prisma.bountyIssues.findFirst({
          where: {
              githubId: issueId,
              htmlUrl: issueLink
          }
      });

      if(!bounty){
        return NextResponse.json({message: 'Bounty not found for this issue'});
    }

    const bountyIssueId = await prisma.bountyIssues.findUnique({
      where: {
          id: bounty.id
      }
  });
      
      
  if(!bountyIssueId?.id){
    return NextResponse.json({message: "Bounty Doesn't exist"}, {status: 500});
}

    const {bountyIssueApprove, transaction} = await prisma.$transaction(async(tx: any) => {
        const bountyIssueApprove = await tx.bountyIssues.update({
            where: {
                id: bountyIssueId.id
            },
            data: {
                status: 'APPROVED',
                contributorId: contributorId.toString()
            }
        });

        const transaction = await tx.transaction.create({
            data: {
                bountyIssueId: bountyIssueId.id,
                type: 'PAYOUT',
                status: 'CONFIRMED',
                bountyAmount: bountyIssueId.bountyAmount,
                bountyAmountInLamports: bountyIssueId.bountyAmountInLamports
            }
        });

        return { bountyIssueApprove, transaction };
    });
      
          const { owner, repo, issue_number } = extractGitHubIssueInfo(issueLink);
          const baseUrl = req.headers.get('origin') || 'http://localhost:3000';
          const octokit = await getInstallationOctokit(owner, repo);
      
          await octokit.issues.createComment({
            owner,
            repo,
            issue_number,
            body: `🎉 Congratulations @${contributorUserName}! This bounty of amount $${bounty.bountyAmount} has been awarded to you. To claim your reward, please visit: gitearn.vercel.app/earn/claim.`
        });
      
          const labelsToRemove = [`💎 Bounty`, `$${bounty.bountyAmount}`];
      
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
      
          return NextResponse.json({ message: 'Bounty Approved successfully' }, { status: 200 });
    } catch(e){
        console.log('Error while approving the bounty status to Approved', e);
        return NextResponse.json({message: 'Error while approving the bounty status to Approved'}, {status: 500});
    }
}