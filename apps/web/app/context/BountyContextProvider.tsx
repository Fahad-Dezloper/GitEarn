/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Keypair, LAMPORTS_PER_SOL, PublicKey, sendAndConfirmTransaction, SystemProgram, Transaction } from '@solana/web3.js';
import axios from 'axios';
import { error } from 'console';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import bs58 from 'bs58'

interface BountyContextType {
  issuesRepo: any[];
  setIssuesRepo: React.Dispatch<React.SetStateAction<any[]>>;
  addBounty: (bountyAmt: any, issueId: any, issueLink: any, title: any) => Promise<void>;
  bountyIssues: any[];
  setBountyIssues: React.Dispatch<React.SetStateAction<any[]>>;
  userBountyIssue: any[];
  removeBounty: ({ issueId, issueLink }: { issueId: string, issueLink: string }) => Promise<void>;
}

const BountyDetailsContext = createContext<BountyContextType | undefined>(undefined);

export function BountyContextProvder({ children }: { children: ReactNode }) {
  const [issuesRepo, setIssuesRepo] = useState([]);
  const [bountyIssues, setBountyIssues] = useState<any[]>([]);
  const [userBountyIssue, setUserBountyIssue] = useState<any[]>([]);
  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();

  async function getIssues() {
    try {
      const res = await axios.get(`/api/issues/get`);
      const reposWithIssues = res.data.filter((repo: { issues: string | any[]; }) => repo.issues && repo.issues.length > 0);
      setIssuesRepo(reposWithIssues);
    } catch (e) {
      console.error("Error while fetching:", e);
    }
  }

  async function getUserBountyIssues(){
    try{
      const res = await axios.get('/api/user/bountyIssues');
      setUserBountyIssue(res.data.UsersBountyIssues);
    } catch(e) {
      console.log("Error fetching user bounty issues");
    }
  }

  async function getBountyIssues() {
    try {
      const res = await axios.get(`${window.location.origin}/api/issues/bounty`);
      setBountyIssues(res.data.BountyIssues);
      console.log("here user bounty issue", res.data.BountyIssues);
    } catch (e) {
      console.log("Error fetching Bounty Issues", e);
    }
  }

  useEffect(() => {
    getIssues();
    getUserBountyIssues();
    getBountyIssues();

    const interval = setInterval(() => {
      console.log("calling again and again")
      getBountyIssues();
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  async function addBounty(bountyAmt: any, issueId: any, issueLink: any, title: any, lamports: any) {
    // alert(lamports);
    // console.log("reached here");

    try {
      if (!publicKey) {
        console.error("Wallet not connected");
        return;
      }

      const add = await axios.post("/api/bounty/add", {
        bountyAmt,
        issueId,
        issueLink,
        lamports
      });

      // console.log("add pending", add);

      console.log(add.data.transaction.id)
      const transactionId = add.data.transaction.id;
      
      const transaction = new Transaction();
      const sendSolInstruction = SystemProgram.transfer({
        fromPubkey: publicKey,
        toPubkey: new PublicKey('6ZDPeVxyRyxQubevCKTM56tUhFq1PRib2BZ66kEp8zrz'),
        lamports: lamports,
      });

      transaction.add(sendSolInstruction);
      
      const signature = await sendTransaction(transaction, connection);
      // console.log("signature", signature);
      // console.log("from", publicKey);
      // console.log("t0", '6ZDPeVxyRyxQubevCKTM56tUhFq1PRib2BZ66kEp8zrz');
      // console.log("lamports", lamports);

      // console.log("reached here moving to confirm");

    const confirm = await axios.post("/api/bounty/confirm", {
      bountyAmt,
      issueId,
      issueLink,  
      title,
      signature,
      from: publicKey,
      lamports,
      transactionId
    });

    console.log("confirm is here", confirm);

    setBountyIssues(confirm.data.bountyIssues);
    getIssues();
    getUserBountyIssues();
  } catch(e){
    console.log("Error adding bounty to the issue", e);
  }
  }


  // check vulnerablity here
  async function removeBounty({issueId, issueLink, lamports}: {issueId: string, issueLink: string, lamports: any}){
    alert(process.env.NEXT_PUBLIC_PRIMARY_WALLET_ADD);
    alert(process.env.NEXT_PUBLIC_PRIMARY_WALLET_PRIVATE_KEY);
    alert(`now here ${lamports}`);

    if(!process.env.NEXT_PUBLIC_PRIMARY_WALLET_ADD){
      return console.error("PRIMARY_WALLET_ADD public key not available");
    }
    if(!process.env.NEXT_PUBLIC_PRIMARY_WALLET_PRIVATE_KEY){
      return console.error("PRIMARY_WALLET_ADD private key not available");
    }
    try {
      const remove = await axios.post('/api/bounty/remove/pending', {
        issueId,
        issueLink,
        lamports
      });
      
      console.log("remove log", remove);
      
      const transactionIdd = remove.data.transaction.id;

      if(!publicKey){
        console.error("Wallet not connected");
        return;
      }

        const keypair = Keypair.fromSecretKey(bs58.decode(process.env.NEXT_PUBLIC_PRIMARY_WALLET_PRIVATE_KEY));

        const transaction = new Transaction().add(
          SystemProgram.transfer({
            fromPubkey: keypair.publicKey,
            toPubkey: publicKey,
            lamports: lamports,
          })
        );

        const signature = await sendAndConfirmTransaction(
          connection,
          transaction,
          [keypair]
        );

        console.log("Transaction Signature:", signature);

      const removeConfirm = await axios.post('/api/bounty/remove', {
        issueId,
        issueLink,
        signature,
        lamports,
        to: publicKey,
        transactionId: transactionIdd
      })

      getIssues();
      getUserBountyIssues();
    } catch (error) {
      console.log("in context provider cancel bounty error", error); 
    }
  }


  // check vulnerablity its happening on client side
  async function approveBounty( issueId: any, issueLink: any, contributorId: any){
    console.log("here reached here", issueId, issueLink, contributorId);
    try{
      const res = await axios.post("/api/bounty/approve/pending", {
        issueId,
        issueLink,
        contributorId
      });
      console.log(res)
      const transactionIdd = res.data.trasaction.id;
  
      // wallet call
  
  
  
      //confirm call
  
      // const signature = 'lsjdflasjdfljasldfjlasdjfljasldfjlasjd'
      // const approveConfirm = await axios.post('/api/bounty/approve', {
      //   issueId,
      //   issueLink,
      //   signature,
      //   to: publicKey,
      //   transactionId: transactionIdd
      // });

    } catch(e){
      console.log("Error while approving the transaction");
    }
  }

  return (
    // @ts-ignore
    <BountyDetailsContext.Provider value={{ issuesRepo, setIssuesRepo, addBounty, bountyIssues, setBountyIssues, userBountyIssue, removeBounty, approveBounty}}>
      {children}
    </BountyDetailsContext.Provider>
  );
}

export function useBountyDetails() {
  const context = useContext(BountyDetailsContext);
  if (context === undefined) {
    throw new Error('useBountyDetails must be used within a BountyContextProvder');
  }
  return context;
}
function decode(NEXT_PUBLIC_PRIMARY_WALLET_PRIVATE_KEY: string | undefined): Uint8Array<ArrayBufferLike> {
  throw new Error('Function not implemented.');
}

