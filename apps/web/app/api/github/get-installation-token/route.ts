import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@repo/db/client";
import { Octokit } from "@octokit/rest";

export async function GET() {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { accounts: true },
    });

    if (!user?.accounts[0]?.access_token) {
      return NextResponse.json(
        { error: "GitHub token not found" },
        { status: 401 }
      );
    }

    // Create Octokit instance with user's access token
    const octokit = new Octokit({ auth: user.accounts[0].access_token });

    // Get installations for the authenticated user
    const { data: installations } = await octokit.apps.listInstallationsForAuthenticatedUser();

    // Find the GitEarn app installation
    const gitEarnInstallation = installations.installations.find(
      (installation) => installation.app_slug === "gitearn-hq"
    );

    if (!gitEarnInstallation) {
      return NextResponse.json(
        { error: "GitEarn app not installed" },
        { status: 404 }
      );
    }

    // Get installation access token
    const { data: installationToken } = await octokit.apps.createInstallationAccessToken({
      installation_id: gitEarnInstallation.id,
    });

    // Calculate expiration time (1 hour from now)
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    // Update the account with the installation token
    await prisma.account.update({
      where: {
        provider_providerAccountId: {
          provider: "github",
          providerAccountId: user.accounts[0].providerAccountId,
        },
      },
      data: {
        refresh_token: installationToken.token,
        expires_at: Math.floor(expiresAt.getTime() / 1000), // Convert to Unix timestamp
      },
    });

    return NextResponse.json(
      { token: installationToken.token },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error getting installation token:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to get installation token" },
      { status: 500 }
    );
  }
} 