/* eslint-disable @typescript-eslint/no-explicit-any */
import { Octokit } from "@octokit/rest";
import prisma from "@repo/db/client";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

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
        const {issueId, issueLink, signature, to, transactionId} = body;

        const from = process.env.NEXT_PUBLIC_PRIMARY_WALLET_ADD;

        if(!signature || !from || !to || transactionId){
            return NextResponse.json({error: 'Missing Required Fields'}, { status: 400 });
        }

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
    
        const octokit = new Octokit({ auth: token });
    
        const bounty = await prisma.bountyIssues.findUnique({
          where: {
            githubId: issueId,
            htmlUrl: issueLink,
          },include: {
            transactions: true
          }
        });

        if (!bounty?.id) {
            return NextResponse.json({ message: 'Bounty not found for this issue' }, { status: 404 });
          }
      
      
          await prisma.$transaction(async (tx) => {
            const transaction = await tx.transaction.update({
              where: {id: transactionId},
              data: {
                status: 'CONFIRMED',
                txnHash: signature,
                bountyAmountInLamports: bounty.bountyAmountInLamports
              },
              include: {
                bountyIssue: true
              }
            });
      
            await tx.bountyIssues.update({
              where: {id: transaction.bountyIssueId},
              data: {status: 'APPROVED', bountyAmountInLamports: bounty.bountyAmountInLamports}
            });
      
            console.log('transaction form confirm', transaction);
            return transaction;
          })
      
          const { owner, repo, issue_number } = extractGitHubIssueInfo(issueLink);
      
          await octokit.issues.createComment({
            owner,
            repo,
            issue_number,
            body: `✅ **$${bounty.bountyAmount} bounty approved** for this issue via GitEarn.\n\n🏆 This bounty has been won by this person.`
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