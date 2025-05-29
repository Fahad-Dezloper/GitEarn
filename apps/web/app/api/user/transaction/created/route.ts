/* eslint-disable @typescript-eslint/no-explicit-any */
import prisma from "@repo/db/client";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(){
    try{
        const session = await getServerSession();


    if(!session?.user?.email){
        return NextResponse.json({message: "Unauthorized request"}, {status: 401});

    }

    const user = await prisma.user.findUnique({
        where: {
            email: session.user.email
        }
    })

    if(!user){
        return NextResponse.json({message: "User not found"}, {status: 404});
    }


    const createdTxn = await prisma.bountyIssues.findMany({
        where: {
            userId: user.id,
            status: {
                in: ["ACTIVE", "PENDING", "CLAIMING", "FAILED", "CANCELED", "CANCELLING", "CLAIMED", "APPROVED"]
            }
        },
        include: {
            transactions: true
        }
    });

    // console.log("txn created", createdTxn);

    function serializePrimitives(obj: any): any {
      if (Array.isArray(obj)) {
        return obj.map(serializePrimitives);
      } else if (obj !== null && typeof obj === 'object') {
        return Object.fromEntries(
          Object.entries(obj).map(([key, value]) => {
            if (typeof value === 'bigint') {
              return [key, value.toString()];
            } else if (value instanceof Date) {
              return [key, value.toISOString()];
            } else {
              return [key, serializePrimitives(value)];
            }
          })
        );
      }
      return obj;
    }
    

      // console.log("after serial", serializePrimitives(createdTxn));

    return NextResponse.json({message: "User created transaction fetched successfully", data: serializePrimitives(createdTxn)}, {status: 200})
    
    } catch(e){
        console.log("Error while fetch user created transaction", e);
        return NextResponse.json({message: "Error while fetch user created transaction" }, { status: 500 })
    }

}