/* eslint-disable @typescript-eslint/no-explicit-any */
import prisma from "@repo/db/client";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest){
    try {
        const session = await getServerSession();
        const body = await req.json();
        const { issueId, issueLink, contributorId } = body;

        console.log("here", issueId, issueLink, contributorId);

        const user = await prisma.user.findFirst({
            where: {
                email: session?.user?.email || undefined
            },
            include: {accounts: true}
        });

        if(!user){
            return NextResponse.json({message: "User not found"}, {status: 404})
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

        const {bountyIssueApprove, transaction} = await prisma.$transaction(async(tx) => {
            const bountyIssueApprove = await tx.bountyIssues.update({
                where: {
                    id: bountyIssueId.id
                },
                data: {
                    status: 'APPROVING'
                }
            });

            const transaction = await tx.transaction.create({
                data: {
                    bountyIssueId: bountyIssueId.id,
                    type: 'PAYOUT',
                    status: 'PENDING',
                    bountyAmount: bountyIssueId.bountyAmount,
                    bountyAmountInLamports: bountyIssueId.bountyAmountInLamports
                }
            });

            return { bountyIssueApprove, transaction };
        });

        function replacer(key: string, value: any) {
            return typeof value === 'bigint' ? value.toString() : value;
          }

          return new NextResponse(
            JSON.stringify({
              message: 'Bounty added for Approval/Pending status successfully',
              bountyIssueApprove,
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
        console.log("Error while approving bounty for pending", e);
        NextResponse.json({message: "Error while approving bounty for pending"}, {status: 500})
    }
}