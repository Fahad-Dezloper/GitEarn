/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import prisma from "@repo/db/client";
import { Connection } from "@solana/web3.js";
import axios from "axios";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";


const connection = new Connection('https://api.devnet.solana.com');

async function ConfirmTxt(signature: any, from: any, to: string, lamports: number) {
    console.log("lamports", lamports, signature, from, to);
    const res = await axios.post(
      "https://solana-devnet.g.alchemy.com/v2/8liAO-lmQabNLQ0We92gFQy_cJYOULew",
      {
        jsonrpc: "2.0",
        id: 1,
        method: "getTransaction",
        params: [
          signature,
          {
            commitment: "confirmed",
          },
        ],
      }
    );
    console.log("main res", res);
    const tx = res.data.result;
    console.log("main transaction", tx);
    if (!tx) {
      console.log("Transaction not found or not confirmed.");
      return false;
    }
  
    const keys = tx.transaction.message.accountKeys;
    const preBalances = tx.meta.preBalances;
    const postBalances = tx.meta.postBalances;
    const fee = tx.meta.fee;
  
    const fromIndex = tx.transaction.message.accountKeys[0];
    const toIndex = tx.transaction.message.accountKeys[1];
  
    // console.log("fromkey", fromIndex, toIndex);
  
    if (!fromIndex || !toIndex) {
      console.log("From or To address are not there.");
      return false;
    }
    
    console.log(`fromIndex: ${fromIndex} || from: ${from} || toIndex: ${toIndex} || to: ${to}`)

    if (fromIndex !== from || toIndex !== to) {
      console.log("From or To address are diffrent.");
      return false;
    }
  
    const balanceChanges = preBalances.map((pre: number, i: string | number) => postBalances[i] - pre);
    const totalReceived = balanceChanges.filter((change: number) => change > 0).reduce((a: any, b: any) => a + b, 0);
    const totalSent = -balanceChanges.filter((change: number) => change < 0).reduce((a: any, b: any) => a + b, 0);
    const total = totalSent - fee;
    let isValid;
    if(total === lamports){
      isValid = true;
    } else {
      isValid = false;
    }
    console.log(total, totalSent, lamports);
    console.log(`Valid: ${isValid}`);
    return isValid;
  }

export async function POST(req: NextRequest){
   try{
    const session = await getServerSession();
    const body = await req.json();

    const { transactionId, to, signature, lamports, issueLink, issueId } = body;

    const from = process.env.NEXT_PUBLIC_PRIMARY_WALLET_ADD;

    if(!transactionId || !to || !signature || !lamports || !issueLink || !issueId){
        return NextResponse.json({message: "Missing required fields"}, {status: 404})
    }

    const confirmTransaction = await ConfirmTxt(signature, from , to, lamports);

    console.log("confirming", confirmTransaction);
    if(!confirmTransaction){
      return NextResponse.json({message: "Transaction mismatch"}, {status: 401});
    }

    if(!session?.user?.email){
        return NextResponse.json({message: "Unauthroized Request"}, {status: 404});
    }
    
    const user = await prisma.user.findFirst({
        where: {
          email: session?.user?.email
        },
        include: { accounts: true },
      });
  
      if (!user) {
        return NextResponse.json({ message: 'User not found' }, { status: 404 });
      }

      const bountyIssueId = await prisma.bountyIssues.findUnique({
        where: {
            githubId: issueId
        }, include: {
            transactions: true
        }
      })

      if(!bountyIssueId?.id){
        return NextResponse.json({message: "Bounty Doesn't exist"}, {status: 500});
      }

      await prisma.$transaction(async(tx) => {
        const transaction = await tx.transaction.update({
            where: {id: transactionId},
            data: {
                status: 'CONFIRMED',
                txnHash: signature,
                bountyAmountInLamports: lamports
            }, include: {
                bountyIssue: true
            }
        });

        await tx.bountyIssues.update({
            where: {id: transaction.bountyIssueId},
            data: {status: 'CLAIMED', bountyAmountInLamports: lamports, contributorClaimedAdd: to}
        });

        console.log('transaction form confirm', transaction);
        return transaction;
      });

      return NextResponse.json({
        message: 'Bounty set to CLAIMED successfully',
      }, { status: 200 });

   } catch(e){
    console.error("Error while Confirming the bounty to CLAIMED", e);
    return NextResponse.json({messgae: 'Error while Confirming the bounty to CLAIMED'}, {status: 500});
   }
}