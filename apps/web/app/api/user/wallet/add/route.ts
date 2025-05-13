/* eslint-disable @typescript-eslint/no-unused-vars */
import prisma from "@repo/db/client";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest){
    console.log("reached here");
    try {
        const session = await getServerSession();
        const body = await req.json();
        const { walletAddress, privyId } = body;
        const email = session?.user?.email
        if(!email){
            return NextResponse.json({message: "Unauthorized Request"}, {status: 404})
        }

        console.log("adding wallet", walletAddress, privyId);


        const user = await prisma.user.update({
            where: { email },
            data: {
                privyDID: privyId,
                solanaAddress: walletAddress
            }
        })

    return NextResponse.json({message: "Wallet Address Added Successfully"}, {status: 200});
    
    }catch(e){
        return NextResponse.json({message: "Error while saving wallet address"}, {status: 500})
    }
}