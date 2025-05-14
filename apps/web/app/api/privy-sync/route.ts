import { NextRequest, NextResponse } from "next/server";
import prisma from "@repo/db/client";

export async function POST(req: NextRequest) {
  try {
    const { email, privyDID, solanaAddress } = await req.json();

    if (!email || !privyDID || !solanaAddress) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // Find user by email
    let user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      user = await prisma.user.create({
        data: { email, privyDID, solanaAddress },
      });
    } else {
      await prisma.user.update({
        where: { email },
        data: { privyDID, solanaAddress },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}