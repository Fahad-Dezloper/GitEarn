import prisma from "@repo/db/client";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

function safeJson(obj: any) {
    return JSON.parse(JSON.stringify(obj, (_, value) =>
      typeof value === 'bigint' ? value.toString() : value
    ));
  }

export async function GET(){
    const userData = getServerSession();
    console.log("i am here")

    if(!userData){
        return NextResponse.json({message: "Unauthorized Request"}, {status: 401});
    }


    try{
        const res = await prisma.bountyIssues.findMany({
            orderBy: {
                createdAt: 'desc'
            }
        });

        console.log("here is your bounty issues", res);
        return NextResponse.json({message: "Bounty issues fetched Successfully", BountyIssues: safeJson(res)}, {status: 200})
    } catch(e){
        console.log("Error fetching bounty Issues", e);
        return NextResponse.json({message: "Error fetching bounty Issues"}, {status: 500})
    }

}