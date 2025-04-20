import { Octokit } from "@octokit/rest";
import prisma from "@repo/db/client";
import axios from "axios";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(){
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { accounts: true },
    });

    const token = user?.accounts[0]?.access_token;

    
    if (!token) {
        return NextResponse.json({ error: 'GitHub token is required' }, { status: 401 });
      }
  
      const userResponse = await axios.get("https://api.github.com/user", {
        headers: { Authorization: `token ${token}` },
      });
  
      const username = userResponse.data.login;
  
      if (!username || typeof username !== 'string') {
        return NextResponse.json({ error: 'Unable to fetch GitHub username' }, { status: 500 });
      }
  
      const octokit = new Octokit({ auth: token });

      try {
        const { data: user } = await octokit.rest.users.getAuthenticated();
        // console.log("Authenticated User:", user);
        return NextResponse.json({message: user}, {status: 200});
      } catch (error) {
        console.error("Error fetching user:", error);
        return NextResponse.json({message: "Error Fetching User Data"}, {status: 500});
      }

}