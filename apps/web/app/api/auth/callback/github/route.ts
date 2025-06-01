import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@repo/db/client";
import { Octokit } from "@octokit/rest";
import { createAppAuth } from "@octokit/auth-app";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get("code");
    const installationId = searchParams.get("installation_id");
    const state = searchParams.get("state");

    if (!code || !installationId) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the user's GitHub account
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { accounts: true },
    });

    if (!user?.accounts[0]?.providerAccountId) {
      return NextResponse.json(
        { error: "GitHub account not found" },
        { status: 401 }
      );
    }

    // Create Octokit instance with app credentials
    const auth = createAppAuth({
      appId: process.env.GITHUB_APP_ID!,
      privateKey: process.env.GITHUB_APP_PRIVATE_KEY!.replace(/\\n/g, '\n'),
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    });
w
    // Get app authentication
    const appAuth = await auth({ type: "app" });
    const octokit = new Octokit({ auth: appAuth.token });

    // Get installation access token
    const { data: installationToken } = await octokit.apps.createInstallationAccessToken({
      installation_id: parseInt(installationId),
    });

    // Calculate expiration time (1 hour from now)
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    // Update the account with the installation token, ID, and expiration
    await prisma.account.update({
      where: {
        provider_providerAccountId: {
          provider: "github",
          providerAccountId: user.accounts[0].providerAccountId,
        },
      },
      data: {
        installationToken: installationToken.token,
        refresh_token: installationToken.token,
        expires_at: Math.floor(expiresAt.getTime() / 1000), // Convert to Unix timestamp
        installation_id: installationId, // Save the installation ID
      },
    });

    // Redirect back to the original state URL or a default page
    const redirectUrl = state || "/earn/bounties/add";
    return NextResponse.redirect(new URL(redirectUrl, request.url));
  } catch (error) {
    console.error("Error processing GitHub callback:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to process callback" },
      { status: 500 }
    );
  }
}
