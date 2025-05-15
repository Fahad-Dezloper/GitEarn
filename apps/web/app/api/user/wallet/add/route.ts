/* eslint-disable @typescript-eslint/no-unused-vars */
import prisma from "@repo/db/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { email, privyId, walletAddress } = await request.json();

  try {
    const user = await prisma.user.findUnique({
        where: {
            email: email,
        }
    });

    if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const updatedUser = await prisma.user.update({
        where: {
            id: user.id,
        },
        data: {
            privyDID: privyId,
            solanaAddress: walletAddress,
        }
    })

    return NextResponse.json({ message: "Wallet added successfully" }, { status: 200 });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
  
}
