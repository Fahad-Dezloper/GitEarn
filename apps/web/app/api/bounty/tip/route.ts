import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@repo/db/client";
import { getInstallationOctokit } from "@/lib/(GitEarnBotComments)/AddBountyComment";

function extractGitHubIssueInfo(url: string) {
    const match = url.match(/github\.com\/([^/]+)\/([^/]+)\/issues\/(\d+)/);
    if (!match) throw new Error("Invalid GitHub issue URL");
    const [, owner, repo, issue_number] = match;
    return { owner, repo, issue_number: Number(issue_number) };
}

async function getGitHubAccessToken(userEmail: string) {
    const account = await prisma.user.findFirst({
      where: {
        email: userEmail,
      },
      include: {
        accounts: true
      }
    });
  
    const githubAccount = account?.accounts.find(
      (acc) => acc.provider === "github"
    );
    return githubAccount?.access_token;
  }

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession();
        const body = await req.json();
        const { signature, transactionId } = body;

        if (!signature || !transactionId) {
            return NextResponse.json({ message: "Missing signature or transactionId" }, { status: 400 });
        }

        const user = await prisma.user.findFirst({
            where: { email: session?.user?.email || undefined },
            include: { accounts: true }
        });

        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        const transaction = await prisma.transaction.findUnique({
            where: { id: transactionId },
            include: { 
                bountyIssue: true
            }
        });

        if (!transaction || !transaction.bountyIssue) {
            return NextResponse.json({ message: "Transaction or related bounty not found" }, { status: 404 });
        }

        const { bountyIssue } = transaction;
        const contributorId = bountyIssue.contributorId;

        await prisma.$transaction(async (tx) => {
            await tx.bountyIssues.update({
                where: { id: bountyIssue.id },
                data: { status: "TIPPED" }
            });

            await tx.transaction.update({
                where: { id: transactionId },
                data: {
                    status: "CONFIRMED",
                    txnHash: signature
                }
            });

            // Create payout transaction
            await tx.transaction.create({
                data: {
                    bountyIssueId: bountyIssue.id,
                    type: "CLAIM",
                    status: "PENDING",
                    bountyAmount: transaction.bountyAmount,
                    bountyAmountInLamports: transaction.bountyAmountInLamports
                }
            });
        });

        const { owner, repo, issue_number } = extractGitHubIssueInfo(bountyIssue.htmlUrl);
        const octokit = await getInstallationOctokit(owner, repo);


        const accessToken = await getGitHubAccessToken(session?.user?.email || "");
    
        if (!accessToken) {
        return NextResponse.json({ message: "GitHub access token not found" }, { status: 401 });
        }
        // Fetch contributor's GitHub username
        let contributorUsername = "Contributor";
        if (contributorId) {
            try {
                const response = await fetch(`https://api.github.com/user/${contributorId}`, {
                    headers: {
                        'Accept': 'application/vnd.github.v3+json',
                        'Authorization': `Bearer ${accessToken}`
                    }
                });
                
                if (response.ok) {
                    const userData = await response.json();
                    contributorUsername = userData.login;
                }
            } catch (error) {
                console.error("Error fetching contributor username:", error);
            }
        }

        console.log("contributor", contributorUsername);

        await octokit.issues.createComment({
            owner,
            repo,
            issue_number,
            body: `🎉 Congratulations @${contributorUsername}!
Your tip has been successfully confirmed. You can now claim your reward here: https://gitearn.vercel.app/earn/claim

Thank you for your contribution! 🙌`
        });

        return NextResponse.json({ message: "Tip confirmed successfully" }, { status: 200 });

    } catch (e) {
        console.log("Error confirming the tip:", e);
        return NextResponse.json({ message: "Error confirming the tip" }, { status: 500 });
    }
}
