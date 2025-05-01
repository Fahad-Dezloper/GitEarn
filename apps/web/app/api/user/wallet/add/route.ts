/* eslint-disable @typescript-eslint/no-unused-vars */
import prisma from "@repo/db/client";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest){
    try {
        const session = await getServerSession();
        const body = await req.json();
        const { walletAddress } = body;

        if(!session?.user?.email){
            return NextResponse.json({message: "Unauthorized Request"}, {status: 401})
        }
    
        const existingUser = await prisma.user.findUnique({
            where: {
              email: session.user.email,
            },
          });

          if (!existingUser) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
          }

        const updatedUser = await prisma.user.update({
            where: {
                email: session.user.email,
            },
            data: {
                walletAddress: walletAddress,
            },
        });
          
            // console.log('Wallet address added:', updatedUser);

            return NextResponse.json({message: "Wallet Address Added Successfully"}, {status: 200});
    
    }catch(e){
        return NextResponse.json({message: "Error while saving wallet address"}, {status: 500})
    }
}