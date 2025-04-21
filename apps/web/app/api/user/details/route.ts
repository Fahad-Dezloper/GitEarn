import { Octokit } from "@octokit/rest";
import prisma from "@repo/db/client";
import axios from "axios";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession();

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { accounts: true },
  });

  const token = user?.accounts[0]?.access_token;
  if (!token) {
    return NextResponse.json({ error: "GitHub token is required" }, { status: 401 });
  }

  const userResponse = await axios.get("https://api.github.com/user", {
    headers: { Authorization: `token ${token}` },
  });

  const githubUser = userResponse.data;

  if (!githubUser?.login || typeof githubUser.login !== "string") {
    return NextResponse.json({ error: "Unable to fetch GitHub username" }, { status: 500 });
  }

  const wakatimeResponse = await fetch(
    `https://wakatime.com/api/v1/users/current/stats/last_7_days`,
    {
      headers: {
        Authorization: `Basic ${Buffer.from(process.env.WAKATIME_API_KEY || "").toString("base64")}`,
      },
      next: { revalidate: 3600 },
    }
  );

  if (!wakatimeResponse.ok) {
    return NextResponse.json({ error: "Failed to fetch WakaTime stats" }, { status: wakatimeResponse.status });
  }

  const wakatimeData = await wakatimeResponse.json();

  const summary = {
    total_coding_hours: wakatimeData.data?.human_readable_total || "N/A",
    top_languages: wakatimeData.data?.languages?.slice(0, 5).map(lang => ({
      name: lang.name,
      hours: lang.text,
    })) || [],
    wakatime_raw: wakatimeData.data // include full raw data if needed
  };

  return NextResponse.json(
    {
      github: githubUser,
      wakatime: summary,
    },
    { status: 200 }
  );
}