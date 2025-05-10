/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import prisma from '@repo/db/client';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { Octokit } from '@octokit/rest';
import axios from 'axios';

function extractGitHubIssueInfo(url: string) {
  const match = url.match(/github\.com\/([^/]+)\/([^/]+)\/issues\/(\d+)/);
  if (!match) throw new Error("Invalid GitHub issue URL");
  const [, owner, repo, issue_number] = match;
  return { owner, repo, issue_number: Number(issue_number) };   
}

async function ConfirmTxt(signature: any, from: any, to: string, lamports: number) {
  console.log("lamports", lamports, signature, from, to);
  const res = await axios.post(
    "https://solana-devnet.g.alchemy.com/v2/8liAO-lmQabNLQ0We92gFQy_cJYOULew",
    {
      jsonrpc: "2.0",
      id: 1,
      method: "getTransaction",
      params: [
        signature,
        {
          commitment: "confirmed",
        },
      ],
    }
  );
  console.log("main res", res);
  const tx = res.data.result;
  console.log("main transaction", tx);
  if (!tx) {
    console.log("Transaction not found or not confirmed.");
    return false;
  }

  const keys = tx.transaction.message.accountKeys;
  const preBalances = tx.meta.preBalances;
  const postBalances = tx.meta.postBalances;
  const fee = tx.meta.fee;

  const fromIndex = tx.transaction.message.accountKeys[0];
  const toIndex = tx.transaction.message.accountKeys[1];

  // console.log("fromkey", fromIndex, toIndex);

  if (!fromIndex || !toIndex) {
    console.log("From or To address are not there.");
    return false;
  }

  if (fromIndex !== from || toIndex !== to) {
    console.log("From or To address are diffrent.");
    return false;
  }

  const balanceChanges = preBalances.map((pre: number, i: string | number) => postBalances[i] - pre);
  const totalReceived = balanceChanges.filter((change: number) => change > 0).reduce((a: any, b: any) => a + b, 0);
  const totalSent = -balanceChanges.filter((change: number) => change < 0).reduce((a: any, b: any) => a + b, 0);
  const total = totalSent - fee;
  let isValid;
  if(total === lamports){
    isValid = true;
  } else {
    isValid = false;
  }
  console.log(total, totalSent, lamports);
  console.log(`Valid: ${isValid}`);
  return isValid;
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();
    const body = await req.json();
    const { issueId, issueLink, signature, lamports, to, transactionId } = body;
    const from = process.env.NEXT_PUBLIC_PRIMARY_WALLET_ADD;

    if (!signature || !from || !to || !lamports) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const confirmTransaction = await ConfirmTxt(signature, from, to, lamports);

    console.log("confirming", confirmTransaction);

    if(!confirmTransaction){
      return NextResponse.json({message: "Transaction mismatch"}, {status: 401});
    }

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


    await prisma.$transaction(async (tx: any) => {
      const transaction = await tx.transaction.update({
        where: {id: transactionId},
        data: {
          status: 'CONFIRMED',
          txnHash: signature,
          bountyAmountInLamports: lamports
        },
        include: {
          bountyIssue: true
        }
      });

      await tx.bountyIssues.update({
        where: {id: transaction.bountyIssueId},
        data: {status: 'CANCELED', bountyAmountInLamports: lamports}
      });

      console.log('transaction form confirm', transaction);
      return transaction;
    })

    const { owner, repo, issue_number } = extractGitHubIssueInfo(issueLink);

    await octokit.issues.createComment({
      owner,
      repo,
      issue_number,
      body: `❌ **$${bounty.bountyAmount} bounty removed** from this issue via GitEarn.`,
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

    return NextResponse.json({ message: 'Bounty removed successfully' }, { status: 200 });

  } catch (e) {
    console.log("Error while removing the bounty or updating GitHub:", e);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
