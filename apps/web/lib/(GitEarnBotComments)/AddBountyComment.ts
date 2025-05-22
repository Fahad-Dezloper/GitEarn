/* eslint-disable @typescript-eslint/no-explicit-any */
import { Octokit } from "@octokit/rest";
import { createAppAuth } from "@octokit/auth-app";
import { Octokit as OctokitApp } from "octokit";

const appId = process.env.GITHUB_APP_ID!;
const privateKey = process.env.GITHUB_APP_PRIVATE_KEY!;
const clientId = process.env.GITHUB_CLIENT_ID!;
const clientSecret = process.env.GITHUB_CLIENT_SECRET!;

export async function getInstallationOctokit(owner: string, repo: string): Promise<Octokit> {
  const appOctokit = new OctokitApp({
    authStrategy: createAppAuth,
    auth: {
      appId,
      privateKey,
      clientId,
      clientSecret,
    },
  });

  const { data: { id: installationId } } = await appOctokit.rest.apps.getRepoInstallation({
    owner,
    repo,
  });

  const { token } = await appOctokit.auth({
    type: "installation",
    installationId,
  });

  return new Octokit({ auth: token });
}

export async function ensureLabelExists(octokit: Octokit, owner: string, repo: string, name: string, color: string, description: string) {
  try {
    await octokit.issues.createLabel({
      owner,
      repo,
      name,
      color,
      description,
    });
  } catch (err: any) {
    if (err.status !== 422) throw err;
  }
}
