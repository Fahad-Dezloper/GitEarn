import prisma from "@repo/db/client";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(){
    try {
        const session = await getServerSession();

        if(!session?.user?.email){
            return NextResponse.json({message: "Unauthorized Request"}, {status: 404});
        }
    
        const res = await prisma.user.findUnique({
            where: {
                email: session?.user?.email
            }, include: {
                accounts: true
            }
        });
    
        // console.log("res to user unique idd", res)
        console.log("res to user unique id", res?.accounts[0].providerAccountId);

        const userGitId = res?.accounts[0].providerAccountId;

        const money = await prisma.bountyIssues.findMany({
            where: {
                status: {
                    in: ['APPROVED', 'CLAIMING']
                },
                contributorId: userGitId
            }
        })

        console.log("this money i have found", money);

        const serializedMoney = money.map(entry => ({
            ...entry,
            githubId: entry.githubId.toString(),
          }));
    
        return NextResponse.json({message: "user claimed money fetched success fully", claimBounties: serializedMoney}, {status: 200})
    } catch (e){
        console.log("error finding user claim money", e);
        return NextResponse.json({message: "money not found"}, {status: 500});
    }
}