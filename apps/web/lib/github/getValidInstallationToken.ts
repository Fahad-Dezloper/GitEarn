import { createAppAuth } from "@octokit/auth-app";
import prisma from "@repo/db/client";

/**
 * Returns a valid GitHub App installation access token
 */
export async function getValidInstallationToken(userEmail: string): Promise<string> {
  const user = await prisma.user.findUnique({
    where: { email: userEmail },
    include: { accounts: true },
  });

  const installationId = user?.accounts[0]?.installation_id;

  if (!installationId) {
    throw new Error("GitHub installation ID not found for user");
  }

  const auth = createAppAuth({
    appId: parseInt(process.env.GITHUB_APP_ID!, 10),
    privateKey: process.env.GITHUB_APP_PRIVATE_KEY!,
  });

  const { token } = await auth({
    type: "installation",
    installationId: parseInt(installationId, 10),
  });


  return token;
}