import prisma from "@repo/db/client";
import axios from "axios";

export async function addBounty(maintainerId: number, issueId: number, htmlUrl: string, bountyAmount: number) {
    try {
        // @ts-ignore
        const user = await prisma.account.findUnique({
            // @ts-ignore
            where: {
                provider_providerAccountId: {
                    provider: "github",
                    providerAccountId: maintainerId.toString(),
                }
            },
            include: {
                user: true
            }
        });

        if (!user) {
            return {
                success: false,
                message: "You need to sign up on GitEarn first before creating a bounty."
            };
        }

        // Check if bounty already exists for this issue
        // @ts-ignore
        const existingBounty = await prisma.bountyIssues.findFirst({
            where: {
                githubId: issueId,
                htmlUrl: htmlUrl,
                status: 'ACTIVE'
            }
        });

        if (existingBounty) {
            return {
                success: false,
                message: "An active bounty already exists for this issue."
            };
        }

        const userId = user.user.id;

        // Fetch current SOL price in USD from CoinGecko using axios
        const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd');
        const solPrice = response.data.solana.usd;
        // Convert USD to SOL, then to lamports
        const solAmount = bountyAmount / solPrice;
        const lamports = Math.round(solAmount * 1e9);

        // @ts-ignore
        const { bountyIssue, transaction } = await prisma.$transaction(async (tx: any) => {
            const bountyIssue = await tx.bountyIssues.create({
                data: {
                    userId: userId,
                    githubId: issueId,
                    htmlUrl: htmlUrl,
                    bountyAmount: bountyAmount,
                    bountyAmountInLamports: lamports
                }
            });

            const transaction = await tx.transaction.create({
                data: {
                    bountyIssueId: bountyIssue.id,
                    type: 'DEPOSIT',
                    status: 'PENDING',
                    bountyAmount: bountyAmount,
                    bountyAmountInLamports: lamports
                }
            });

            return { bountyIssue, transaction };
        });

        return {
            success: true,
            data: {
                bountyAmount,
                transactionId: transaction.id
            }
        };

    } catch (error) {
        console.error("Error while adding bounty:", error);
        return {
            success: false,
            message: "An error occurred while creating the bounty. Please try again later."
        };
    }
}


export async function cancelBounty(issueId: number, htmlUrl: string, _maintainerId: number){
    try {
        // @ts-ignore
        const res = await prisma.bountyIssues.findFirst({
            where: {
                githubId: issueId,
                htmlUrl: htmlUrl,
                status: 'ACTIVE'
            }
        });

        if(!res) {
            return {
                success: false,
                message: "No active bounty found on this issue"
            };
        }

        // @ts-ignore
        const {bountyIssueRemove, transaction} = await prisma.$transaction(async(tx: any) => {
            const bountyIssueRemove = await tx.bountyIssues.update({
                where: {
                    id: res.id
                },
                data: {
                    status: 'CANCELLING'
                }
            });
        
            const transaction = await tx.transaction.create({
                data: {
                    bountyIssueId: res.id,
                    type: 'WITHDRAWAL',
                    status: 'PENDING',
                    bountyAmount: res.bountyAmount,
                    bountyAmountInLamports: res.bountyAmountInLamports
                }
            });
        
            return {bountyIssueRemove, transaction};
        });

        return {
            success: true,
            data: {
                bountyAmount: res.bountyAmount,
                transactionId: transaction.id
            }
        };

    } catch(e) {
        console.error("Error while cancelling the bounty:", e);
        return {
            success: false,
            message: "An error occurred while cancelling the bounty"
        };
    }
}


export async function approveBounty(issueId: number, htmlUrl: string, contributorId: number) {
    try {
        // @ts-ignore
        const bountyIssue = await prisma.bountyIssues.findFirst({
            where: {
                githubId: issueId,
                htmlUrl: htmlUrl,
                status: 'ACTIVE'
            }
        });

        if (!bountyIssue) {
            return {
                success: false,
                message: "No active bounty found for this issue."
            };
        }

        // @ts-ignore
        const { bountyIssueApprove, transaction } = await prisma.$transaction(async (tx: any) => {
            const bountyIssueApprove = await tx.bountyIssues.update({
                where: {
                    id: bountyIssue.id
                },
                data: {
                    status: 'APPROVED',
                    contributorId: contributorId.toString()
                }
            });

            const transaction = await tx.transaction.create({
                data: {
                    bountyIssueId: bountyIssue.id,
                    type: 'PAYOUT',
                    status: 'CONFIRMED',
                    bountyAmount: bountyIssue.bountyAmount,
                    bountyAmountInLamports: bountyIssue.bountyAmountInLamports
                }
            });

            return { bountyIssueApprove, transaction };
        });

        return {
            success: true,
            data: {
                bountyAmount: bountyIssue.bountyAmount,
                transactionId: transaction.id
            }
        };

    } catch (error) {
        console.error("Error while approving bounty:", error);
        return {
            success: false,
            message: "An error occurred while processing the bounty approval."
        };
    }
}

export async function isMaintainer(context: any, _userId: number, repoOwner: string, repoName: string) {
    try {
        // First check if user is the repository owner
        if (context.payload.comment.user.login === repoOwner) {
            return true;
        }

        // Then check collaborator permissions using the authenticated GitHub client
        const response = await context.octokit.repos.getCollaboratorPermissionLevel({
            owner: repoOwner,
            repo: repoName,
            username: context.payload.comment.user.login
        });

        return response.data.permission === 'admin' || response.data.permission === 'write';
    } catch (error) {
        console.error("Error checking maintainer status:", error);
        return false;
    }
}
