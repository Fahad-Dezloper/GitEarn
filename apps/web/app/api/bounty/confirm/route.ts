/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import prisma from '@repo/db/client';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { Octokit } from '@octokit/rest';
import { Connection, PublicKey } from '@solana/web3.js';
import axios from 'axios';
import { isValid } from 'date-fns';

const connection = new Connection('https://api.devnet.solana.com');


function safeJson(obj: any) {
  return JSON.parse(JSON.stringify(obj, (_, value) =>
    typeof value === 'bigint' ? value.toString() : value
  ));
}

function extractGitHubIssueInfo(url: string) {
  const match = url.match(/github\.com\/([^/]+)\/([^/]+)\/issues\/(\d+)/);
  if (!match) throw new Error("Invalid GitHub issue URL");
  const [, owner, repo, issue_number] = match;
  return { owner, repo, issue_number: Number(issue_number) };   
}

async function ConfirmTxt(signature: any, from: any, to: string, lamports: number) {
  // console.log("lamports", lamports, signature, from, to);
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
  // console.log("main res", res);
  const tx = res.data.result;
  // console.log("main transaction", tx);
  if (!tx) {
    // console.log("Transaction not found or not confirmed.");
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
    // console.log("From or To address are not there.");
    return false;
  }

  if (fromIndex !== from || toIndex !== to) {
    // console.log("From or To address are diffrent.");
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
  // console.log(total, totalSent, lamports);
  // console.log(`Valid: ${isValid}`);
  return isValid;
}


export async function POST(req: NextRequest) {
  // console.log("inside backend now")
  try {
    const session = await getServerSession();
    const body = await req.json();
    const { bountyAmt, issueId, issueLink, signature, from, lamports, transactionId} = body;
    const to = process.env.NEXT_PUBLIC_PRIMARY_WALLET_ADD;
    // console.log("feilds", signature, from, to, lamports);

    if (!signature || !from || !to || !lamports) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const confirmTransaction = await ConfirmTxt(signature, from, to, lamports);

    // console.log("confirming", confirmTransaction);
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

    const bountyIssueId = await prisma.bountyIssues.findUnique({
      where: {
        githubId: issueId
      }, include: {
        transactions: true
      }
    })

    if(!bountyIssueId?.id){
      return NextResponse.json({message: "Bounty Doesn't exist"}, {status: 500});
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
        data: {status: 'ACTIVE', bountyAmountInLamports: lamports}
      });

      // console.log('transaction form confirm', transaction);
      return transaction;
    })


    const { owner, repo, issue_number } = extractGitHubIssueInfo(issueLink);
    const baseUrl = req.headers.get('origin') || 'http://localhost:3000';

    await octokit.issues.createComment({
      owner,
      repo,
      issue_number,
    body: `
 💎 **$${bountyAmt} bounty** • [GitEarn](${baseUrl}/earn)

---

### Steps to claim:

1. **Start working**: Sign up on [GitEarn](${baseUrl}/earn) and start your implementation.
2. **Submit work**: Create a pull request mentioning this issue.
3. **Receive payment**: 100% of the bounty is sent within 2–5 days after approval.

---

📖 **Important:** Please read the [Participation Guide](https://github.com/your-org/your-repo/blob/main/README.md) before starting!

Thank you for contributing! 🚀
    `    
    });

    
    const createLabelIfNotExists = async (name: string, color: string, description: string) => {
      try {
        await octokit.issues.createLabel({ owner, repo, name, color, description });
      } catch (err: any) {
        if (err.status !== 422) throw err;
      }
    };

    await createLabelIfNotExists(`💎 Bounty`, '0e8a16', 'This issue has a bounty via GitEarn');
    await createLabelIfNotExists(`$${bountyAmt}`, '5319e7', `Bounty amount: $${bountyAmt}`);

    await octokit.issues.addLabels({
      owner,
      repo,
      issue_number,
      labels: [`💎 Bounty`, `$${bountyAmt}`]
    });

    const allBounties = await prisma.bountyIssues.findMany({
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({
      message: 'Bounty added successfully',
      bountyIssues: safeJson(allBounties),
    }, { status: 200 });

  } catch (e) {
    console.error("Error while saving the bounty data or updating GitHub:", e);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}