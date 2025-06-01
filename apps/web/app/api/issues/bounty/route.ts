/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { getValidInstallationToken } from "@/lib/github/getValidInstallationToken";
import prisma from "@repo/db/client";
import { getServerSession } from "next-auth";
import { Session } from "next-auth";
import { NextResponse } from "next/server";

function safeJson(obj: any) {
  return JSON.parse(
    JSON.stringify(obj, (_, value) =>
      typeof value === "bigint" ? value.toString() : value
    )
  );
}

export async function GET() {
  const session = await getServerSession() as Session & { user: { id: string, email: string } };
  if (!session?.user?.email) {
    return NextResponse.json({ message: "Unauthorized Request" }, { status: 401 });
  }

  try {
    const issues = await prisma.bountyIssues.findMany({
      where: {
        status: {
          in: ["ACTIVE", "CANCELLING"],
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });


    const colorRes = await fetch("https://raw.githubusercontent.com/ozh/github-colors/master/colors.json");
    const colorData = await colorRes.json();

    const enrichedIssues = issues.map((issue) => {
      const enrichedTechnologies = issue.technologies.map((tech: string) => ({
        name: tech,
        color: colorData[tech]?.color || "#000000",
      }));

      return {
        ...issue,
        technologies: enrichedTechnologies,
      };
    });

    return NextResponse.json(
      {
        message: "Bounty issues fetched successfully",
        BountyIssues: safeJson(enrichedIssues),
      },
      { status: 200 }
    );
  } catch (e) {
    console.error("Error fetching bounty issues", e);
    return NextResponse.json({ message: "Error fetching bounty issues" }, { status: 500 });
  }
}
