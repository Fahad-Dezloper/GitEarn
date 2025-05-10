
/* eslint-disable @typescript-eslint/no-explicit-any */
import prisma from "@repo/db/client";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const session = await getServerSession();
    const body = await req.json();
    const { contributorId, walletAdd, bountyAmountInLamports, githubId, htmlUrl } = body;

    if(!contributorId || !walletAdd || !bountyAmountInLamports || !githubId || !htmlUrl){
        return NextResponse.json({message: "Fields Missing"}, {status: 404})
    }

    // console.log("session", session);
  try{
    if(!session?.user?.email){
        return NextResponse.json({message: "Unauthorized Request"}, {status: 404});
    }

    const user = await prisma.user.findUnique({
        where: {
            email: session?.user?.email
        }
    })
    
    console.log("user id", user);
    const userIdd = user?.id;

    console.log("user id", userIdd);

    const checkingPendingBounty = await prisma.bountyIssues.findUnique({
        where: {
            githubId: githubId,
            contributorId: contributorId,
            htmlUrl: htmlUrl,
            status: 'APPROVED'
        }
    });

    if(!checkingPendingBounty){
        return NextResponse.json({message: "There is no pending bounty for this issue"}, {status: 500})
    }

    const {bountyIssueClaim, transaction} = await prisma.$transaction(async(tx: any) => {
        const bountyIssueClaim = await tx.bountyIssues.update({
            where: {
                id: checkingPendingBounty.id
            },
            data: {
                status: 'CLAIMING'
            }
        });

        const transaction = await tx.transaction.create({
            data: {
                bountyIssueId: checkingPendingBounty.id,
                type: 'CLAIM',
                status: 'PENDING',
                bountyAmount: bountyIssueClaim.bountyAmount,
                bountyAmountInLamports: bountyIssueClaim.bountyAmountInLamports
            }
        });

        return { bountyIssueClaim, transaction };
    });

    function replacer(key: string, value: any) {
        return typeof value === 'bigint' ? value.toString() : value;
      }

      return new NextResponse(
        JSON.stringify({
          message: 'Bounty added for Claiming/Pending status successfully',
          bountyIssueClaim,
          transaction
        }, replacer),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json"
          }
        }
      );

  } catch(e){
    console.log("Error while claiming bounty for pending", e);
    NextResponse.json({message: "Error while claiming bounty for pending"}, {status: 500})
  }
}