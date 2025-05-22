/* eslint-disable @typescript-eslint/no-explicit-any */
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { Octokit } from "@octokit/core";
import { createAppAuth } from "@octokit/auth-app";
import prisma from "@repo/db/client";

export async function GET() {
  const session = await getServerSession();

  const email = session?.user?.email;
  if (!email) {
    return NextResponse.json({ installed: false });
  }

  const user = await prisma.user.findUnique({
    where: { email },
    include: { accounts: true },
  });

  if (!user) {
    return NextResponse.json(
      { message: "Unauthorized Request" },
      { status: 401 }
    );
  }

  const userGithubId = user.accounts[0]?.providerAccountId;
  if (!userGithubId) {
    return NextResponse.json({ installed: false });
  }

  const auth = createAppAuth({
    appId: process.env.GITHUB_APP_ID!,
    privateKey: process.env.GITHUB_APP_PRIVATE_KEY!.replace(/\\n/g, '\n'),
    clientId: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
  });

  const appAuth = await auth({ type: "app" });
  const octokit = new Octokit({ auth: appAuth.token });

  try {
    const { data: installations } = await octokit.request('GET /app/installations');
    const userInstall = installations.find((inst: any) => inst.account?.id == Number(userGithubId));
    return NextResponse.json({ installed: !!userInstall });
  } catch (e: any) {
    console.log("Error while checking installation", e)
    return NextResponse.json({ installed: false });
  }
}