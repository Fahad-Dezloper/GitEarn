/* eslint-disable @typescript-eslint/no-explicit-any */
import prisma from '@repo/db/client';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();
    const body = await req.json();
    const { bountyAmt, issueId, issueLink, lamports } = body;
    // console.log(bountyAmt, issueId, issueLink);

    const user = await prisma.user.findFirst({
      where: {
        email: session?.user?.email || undefined
      },
      include: { accounts: true },
    });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const { bountyIssue, transaction } = await prisma.$transaction(async (tx) => {
      const bountyIssue = await tx.bountyIssues.create({
        data: {
          userId: user.id,
          githubId: issueId,
          htmlUrl: issueLink,
          bountyAmount: bountyAmt,
          bountyAmountInLamports: lamports
        }
      });

      const transaction = await tx.transaction.create({
        data: {
          bountyIssueId: bountyIssue.id,
          type: 'DEPOSIT',
          status: 'PENDING',
          bountyAmount: bountyAmt,
          bountyAmountInLamports: lamports
        }
      });

      return { bountyIssue, transaction };
    });

    // console.log("transaction", transaction);
    // console.log("bountyIssue while adding", bountyIssue);

    function replacer(key: string, value: any) {
      return typeof value === 'bigint' ? value.toString() : value;
    }

    return new NextResponse(
      JSON.stringify({
        message: 'Bounty added with pending status successfully',
        bountyIssue,
        transaction
      }, replacer),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

  } catch (e) {
    console.error("Error while saving the bounty data or updating GitHub:", e);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
