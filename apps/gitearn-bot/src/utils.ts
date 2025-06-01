import prisma from "@repo/db/client";
import { createAppAuth } from "@octokit/auth-app";
import axios from "axios";

export async function getValidInstallationToken(userEmail: string): Promise<string> {
    // @ts-ignore
    const user = await prisma.user.findUnique({
      where: { email: userEmail },
      include: { accounts: true },
    });
  
    const installationId = user?.accounts[0]?.installation_id;
  
    if (!installationId) {
      throw new Error("GitHub installation ID not found for user");
    }
  
    const auth = createAppAuth({
      appId: parseInt(process.env.APP_ID!, 10),
      privateKey: process.env.PRIVATE_KEY!,
    });
  
    const { token } = await auth({
      type: "installation",
      installationId: parseInt(installationId, 10),
    });
  
  
    return token;
  }

export async function addBounty(maintainerId: number, issueId: number, htmlUrl: string, bountyAmount: number, title: string, repoFullName: string) {
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
        const token = await getValidInstallationToken(user.user.email);

        // Fetch repository languages from GitHub API
        const [owner, repo] = repoFullName.split('/');
        const languagesResponse = await axios.get(`https://api.github.com/repos/${owner}/${repo}/languages`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });
        const technologies = Object.keys(languagesResponse.data).map(lang => lang.toLowerCase());


        const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd');
        const solPrice = response.data.solana.usd;
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
                    bountyAmountInLamports: lamports,
                    repoName: repoFullName,
                    technologies: technologies,
                    title: title
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

export async function TipUser(issueId: number, htmlUrl: string, senderId: number, recipientId: number, amount: number) {
    try {
        // Validate maximum tip amount
        if (amount > 5000) {
            return {
                success: false,
                message: "Maximum tip amount cannot exceed $5000."
            };
        }

        // @ts-ignore
        const sender = await prisma.account.findUnique({
            where: {
                provider_providerAccountId: {
                    provider: "github",
                    providerAccountId: senderId.toString(),
                }
            },
            include: {
                user: true
            }
        });

        if (!sender) {
            return {
                success: false,
                message: "Sender needs to sign up on GitEarn first before sending tips."
            };
        }

        // @ts-ignore
        const recipient = await prisma.account.findUnique({
            where: {
                provider_providerAccountId: {
                    provider: "github",
                    providerAccountId: recipientId.toString(),
                }
            },
            include: {
                user: true
            }
        });

        // console.log('recipient', recipient);

        if (!recipient) {
            return {
                success: false,
                message: "Recipient needs to sign up on GitEarn first to receive tips."
            };
        }

        // Fetch current SOL price in USD from CoinGecko
        const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd');
        const solPrice = response.data.solana.usd;
        // Convert USD to SOL, then to lamports
        const solAmount = amount / solPrice;
        const lamports = Math.round(solAmount * 1e9);

        // @ts-ignore
        const { bountyIssue, transaction } = await prisma.$transaction(async (tx: any) => {
            // Create a bounty issue for the tip
            const bountyIssue = await tx.bountyIssues.create({
                data: {
                    userId: sender.user.id,
                    githubId: issueId,
                    htmlUrl: htmlUrl,
                    status: 'TIPPING',
                    contributorId: recipient.providerAccountId,
                    bountyAmount: amount,
                    bountyAmountInLamports: lamports
                }
            });

            // Create the transaction linked to the bounty issue
            const transaction = await tx.transaction.create({
                data: {
                    bountyIssueId: bountyIssue.id,
                    type: 'PAYOUT',
                    status: 'PENDING',
                    bountyAmount: amount,
                    bountyAmountInLamports: lamports
                }
            });

            return { bountyIssue, transaction };
        });

        return {
            success: true,
            data: {
                amount,
                transactionId: transaction.id
            }
        };

    } catch (error) {
        console.error("Error while processing tip:", error);
        return {
            success: false,
            message: "An error occurred while processing the tip. Please try again later."
        };
    }
}
