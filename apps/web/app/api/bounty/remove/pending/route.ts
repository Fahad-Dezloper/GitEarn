/* eslint-disable @typescript-eslint/no-explicit-any */
import prisma from '@repo/db/client';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();
    const body = await req.json();
    const { issueId, issueLink, lamports } = body;

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

    const bounty = await prisma.bountyIssues.findFirst({
      where: {
        githubId: issueId,
        htmlUrl: issueLink,
      },
    });


    if (!bounty) {
      return NextResponse.json({ message: 'Bounty not found for this issue' }, { status: 404 });
    }


    const bountyIssueId = await prisma.bountyIssues.findUnique({
      where: {
        id: bounty.id,
      }
    });

    if(!bountyIssueId?.id){
        return NextResponse.json({message: "Bounty Doesn't exist"}, {status: 500});
    }

    const {bountyIssueRemove, transaction} = await prisma.$transaction(async(tx) => {
    const bountyIssueRemove = await tx.bountyIssues.update({
        where: {
            id: bountyIssueId.id
        },
        data: {
            status: 'CANCELLING'
        }
    })

    const transaction = await tx.transaction.create({
       data: {
        bountyIssueId: bountyIssueId.id,
        type: 'WITHDRAWAL',
        status: 'PENDING',
        bountyAmount: bountyIssueId.bountyAmount,
        bountyAmountInLamports: lamports
       }
    })

    return {bountyIssueRemove, transaction};

  })

  // console.log("transaction", transaction);
  //   console.log("bountyIssue while cancelling", bountyIssueRemove);

    function replacer(key: string, value: any) {
      return typeof value === 'bigint' ? value.toString() : value;
    }

    return new NextResponse(
      JSON.stringify({
        message: 'Bounty added with CANCELLING/WITHDRAW status successfully',
        bountyIssueRemove,
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
    console.log("Error while removing the bounty or updating GitHub:", e);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
