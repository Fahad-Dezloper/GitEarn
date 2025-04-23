import prisma from '@repo/db/client';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';



function safeJson(obj: any) {
    return JSON.parse(JSON.stringify(obj, (_, value) =>
      typeof value === 'bigint' ? value.toString() : value
    ));
  }

export async function POST(req: NextRequest) {
    try {
        const data = await getServerSession();
        const body = await req.json();
        const { bountyAmt, issueId, issueLink, title } = body;

        const UserDet = await prisma.user.findFirst({
            where: {
                email: data?.user?.email || undefined
            }
        });

        if (!UserDet) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        await prisma.bountyIssues.create({
            data: {
                userId: UserDet.id,
                githubId: issueId,
                htmlUrl: issueLink,
                bounty: bountyAmt
            }
        });

        // Fetch updated bountyIssues
        const allBounties = await prisma.bountyIssues.findMany({
            orderBy: {
                createdAt: 'desc'
            }
        });

        // console.log("updated bounties", allBounties);

        return NextResponse.json({message: 'Bounty added successfully',
            bountyIssues: safeJson(allBounties)}, { status: 200 });

    } catch (e) {
        console.error("Error while saving the bounty data to DB:", e);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
