/* eslint-disable @typescript-eslint/no-explicit-any */

import prisma from "@repo/db/client";
import axios from "axios";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { accounts: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    
    const token = user?.accounts[0]?.access_token;
    
    if (!token) {
      return NextResponse.json({ error: "GitHub token is required" }, { status: 401 });
    }
    
    const userPrivyId = user.privyDID;

    // Fetch GitHub user data
    const userResponse = await axios.get("https://api.github.com/user", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const githubUser = userResponse.data;

    if (!githubUser?.login || typeof githubUser.login !== "string") {
      return NextResponse.json({ error: "Unable to fetch GitHub username" }, { status: 500 });
    }

    // Fetch user's repositories for additional stats
    let repositories = [];
    let githubStats = {
      total_stars: 0,
      total_forks: 0,
      languages: [] as Array<{name: string; count: number; percentage: number}>
    };



    try {
      const reposResponse = await axios.get(`https://api.github.com/users/${githubUser.login}/repos?per_page=100&sort=updated`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      repositories = reposResponse.data;

      // Calculate repository statistics
      let totalStars = 0;
      let totalForks = 0;
      const languageCount: {[key: string]: number} = {};

      repositories.forEach((repo: any) => {
        totalStars += repo.stargazers_count || 0;
        totalForks += repo.forks_count || 0;
        
        if (repo.language) {
          languageCount[repo.language] = (languageCount[repo.language] || 0) + 1;
        }
      });

      // Process languages
      const totalRepos = Object.values(languageCount).reduce((sum: number, count: number) => sum + count, 0);
      const languages = Object.entries(languageCount)
        .map(([name, count]) => ({
          name,
          count,
          percentage: totalRepos > 0 ? (count / totalRepos) * 100 : 0
        }))
        .sort((a, b) => b.count - a.count);

      githubStats = {
        total_stars: totalStars,
        total_forks: totalForks,
        languages: languages.slice(0, 10) // Top 10 languages
      };

    } catch (error) {
      console.error("Error fetching GitHub repositories:", error);
    }

    // Get WakaTime API key from request headers
    const wakaTimeApiKey = request.headers.get('x-wakatime-api-key');

    let wakatimeData = null;
    if (wakaTimeApiKey) {
      try {
        const wakatimeResponse = await fetch(
          "https://wakatime.com/api/v1/users/current/stats/last_7_days",
          {
            headers: {
              Authorization: `Basic ${Buffer.from(wakaTimeApiKey).toString("base64")}`,
            },
            next: { revalidate: 3600 },
          }
        );

        if (wakatimeResponse.ok) {
          wakatimeData = await wakatimeResponse.json();
        }
      } catch (error) {
        console.error("Error fetching WakaTime data:", error);
      }
    }

    const wakatimeSummary = wakatimeData ? {
      total_coding_hours: wakatimeData.data?.human_readable_total || "N/A",
      top_languages: wakatimeData.data?.languages?.slice(0, 5).map((lang: { name: any; text: any; }) => ({
        name: lang.name,
        hours: lang.text,
      })) || [],
      wakatime_raw: wakatimeData.data 
    } : null;

    return NextResponse.json(
      {
        github: {
          ...githubUser,
          // Ensure we have all the fields we need
          followers: githubUser.followers || 0,
          following: githubUser.following || 0,
          public_repos: githubUser.public_repos || 0,
          created_at: githubUser.created_at,
        },
        githubStats,
        wakatime: wakatimeSummary,
        userPrivyId: userPrivyId,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error in user details route:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}