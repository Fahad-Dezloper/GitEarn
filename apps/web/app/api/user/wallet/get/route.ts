import prisma from "@repo/db/client";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(){
    try{
        const session = await getServerSession();

        if(!session || !session.user?.email){
            return NextResponse.json({message: "Unauthorized request"}, {status: 401});
        }

        const res = await prisma.user.findFirst({
            where: {
                email: session.user.email
            }
        });

        // console.log("res here", res);

        return NextResponse.json({message: "Wallet Address Found Successfully", walletAdd: res?.walletAddress}, {status: 200});
    } catch(e){
        return NextResponse.json({message: "Error while fetching user wallet Address"}, {status: 500});
    }
}