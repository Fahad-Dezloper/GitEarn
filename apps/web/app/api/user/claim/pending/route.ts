/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import prisma from "@repo/db/client";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const session = await getServerSession();
  const body = await req.json();
  const { contributorId, walletAdd, bountyAmountInLamports, githubId, htmlUrl, status } = body;
  console.log("reached here");

  if (!contributorId || !walletAdd || !bountyAmountInLamports || !githubId || !htmlUrl) {
    return NextResponse.json({ message: "Fields Missing" }, { status: 404 });
  }

  try {
    if (!session?.user?.email) {
      return NextResponse.json({ message: "Unauthorized Request" }, { status: 404 });
    }

    const user = await prisma.user.findUnique({
      where: {
        email: session?.user?.email
      },
      include: {
        accounts: true
      }
    });

    const userIdd = user?.id;

    const checkingPendingBounty = await prisma.bountyIssues.findFirst({
      where: {
        githubId,
        contributorId,
        htmlUrl,
        status: {
          in: ["APPROVED", "TIPPED"]
        },
      }
    });

    if (!checkingPendingBounty) {
      return NextResponse.json({ message: "There is no pending bounty for this issue" }, { status: 500 });
    }

    console.log("reached here1");

    // 🔁 Check if a transaction already exists
     if(status === "TIPPED") {
      const existingTransaction = await prisma.transaction.findFirst({
        where: {
          bountyIssueId: checkingPendingBounty.id,
          status: "PENDING",
          type: "CLAIM"
        }
      });

      console.log("reached here3");

      if (existingTransaction) {

        function replacer(key: string, value: any) {
          return typeof value === 'bigint' ? value.toString() : value;
        }

        return new NextResponse(
          JSON.stringify({
            message: 'Transaction already exists for this bounty',
            bountyIssueClaim: checkingPendingBounty,
            transaction: existingTransaction
          }, replacer),
          {
            status: 200,
            headers: {
              "Content-Type": "application/json"
            }
          }
        );
      }
     } else {
       const existingTransaction = await prisma.transaction.findFirst({
         where: {
           bountyIssueId: checkingPendingBounty.id,
           status: "PENDING",
           type: "WITHDRAWAL"
         }
       });

       console.log("reached here3");

      if (existingTransaction) {

        function replacer(key: string, value: any) {
          return typeof value === 'bigint' ? value.toString() : value;
        }

        return new NextResponse(
          JSON.stringify({
            message: 'Transaction already exists for this bounty',
            bountyIssueClaim: checkingPendingBounty,
            transaction: existingTransaction
          }, replacer),
          {
            status: 200,
            headers: {
              "Content-Type": "application/json"
            }
          }
        );
    }
     }

    console.log("tipped reach here", status)
    const { bountyIssueClaim, transaction } = await prisma.$transaction(async (tx: any) => {
      let bountyIssueClaim;
      let transaction;
    
      if (status === "TIPPED") {
        bountyIssueClaim = checkingPendingBounty;
    
        transaction = await tx.transaction.create({
          data: {
            bountyIssueId: checkingPendingBounty.id,
            type: 'CLAIM',
            status: 'PENDING',
            bountyAmount: bountyIssueClaim.bountyAmount,
            bountyAmountInLamports: bountyIssueClaim.bountyAmountInLamports
          }
        });
    
      } else {
        bountyIssueClaim = await tx.bountyIssues.update({
          where: {
            id: checkingPendingBounty.id
          },
          data: {
            status: 'CLAIMING'
          }
        });
    
        transaction = await tx.transaction.create({
          data: {
            bountyIssueId: checkingPendingBounty.id,
            type: 'WITHDRAWAL',
            status: 'PENDING',
            bountyAmount: bountyIssueClaim.bountyAmount,
            bountyAmountInLamports: bountyIssueClaim.bountyAmountInLamports
          }
        });
      }
    
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

  } catch (e) {
    console.log("Error while claiming bounty for pending", e);
    return NextResponse.json({ message: "Error while claiming bounty for pending" }, { status: 500 });
  }
}
