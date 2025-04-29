/* eslint-disable @typescript-eslint/no-explicit-any */
import prisma from '@repo/db/client';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { Octokit } from '@octokit/rest';

function safeJson(obj: any) {
  return JSON.parse(JSON.stringify(obj, (_, value) =>
    typeof value === 'bigint' ? value.toString() : value
  ));
}

function extractGitHubIssueInfo(url: string) {
  const match = url.match(/github\.com\/([^/]+)\/([^/]+)\/issues\/(\d+)/);
  if (!match) throw new Error("Invalid GitHub issue URL");
  const [, owner, repo, issue_number] = match;
  return { owner, repo, issue_number: Number(issue_number) };   
}

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

    const token = user.accounts[0]?.access_token;

    if (!token) {
      return NextResponse.json({ error: 'GitHub token is required' }, { status: 401 });
    }

    const octokit = new Octokit({ auth: token });

    await prisma.bountyIssues.create({
      data: {
        userId: user.id,
        githubId: issueId,
        htmlUrl: issueLink,
        bounty: bountyAmt
      }
    });

    const { owner, repo, issue_number } = extractGitHubIssueInfo(issueLink);
    const baseUrl = req.headers.get('origin') || 'http://localhost:3000';

    await octokit.issues.createComment({
      owner,
      repo,
      issue_number,
    //   body: `🔗 This issue has a bounty of **$${bountyAmt}** via [GitEarn](${baseUrl}/earn)!
    
    // Please read the [Participation Guide](https://github.com/your-org/your-repo/blob/main/README.md) before starting.
    
    // Good luck! 🚀`
    body: `
 💎 **$${bountyAmt} bounty** • [GitEarn](${baseUrl}/earn)

---

### Steps to claim:

1. **Start working**: Sign up on [GitEarn](${baseUrl}/earn) and start your implementation.
2. **Submit work**: Create a pull request mentioning this issue.
3. **Receive payment**: 100% of the bounty is sent within 2–5 days after approval.

---

📖 **Important:** Please read the [Participation Guide](https://github.com/your-org/your-repo/blob/main/README.md) before starting!

Thank you for contributing! 🚀
    `    
    });

    
    const createLabelIfNotExists = async (name: string, color: string, description: string) => {
      try {
        await octokit.issues.createLabel({ owner, repo, name, color, description });
      } catch (err: any) {
        if (err.status !== 422) throw err;
      }
    };

    await createLabelIfNotExists(`💎 Bounty`, '0e8a16', 'This issue has a bounty via GitEarn');
    await createLabelIfNotExists(`$${bountyAmt}`, '5319e7', `Bounty amount: $${bountyAmt}`);

    await octokit.issues.addLabels({
      owner,
      repo,
      issue_number,
      labels: [`💎 Bounty`, `$${bountyAmt}`]
    });

    const allBounties = await prisma.bountyIssues.findMany({
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({
      message: 'Bounty added successfully',
      bountyIssues: safeJson(allBounties)
    }, { status: 200 });

  } catch (e) {
    console.error("Error while saving the bounty data or updating GitHub:", e);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}