/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import prisma from '@repo/db/client';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    
    const session = await getServerSession();
    const body = await req.json();
    const { bountyAmt, issueId, issueLink, title } = body;

    const user = await prisma.user.findFirst({
      where: {
        email: session?.user?.email || undefined
      },
      include: { accounts: true },
    });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    await prisma.bountyIssues.create({
      data: {
        userId: user.id,
        githubId: issueId,
        htmlUrl: issueLink,
        bounty: bountyAmt,
        state: "pending"
      }
    });

    return NextResponse.json({
      message: 'Bounty added successfully',
    }, { status: 200 });

  } catch (e) {
    console.error("Error while saving the bounty data or updating GitHub:", e);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}