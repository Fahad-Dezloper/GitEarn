/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Keypair, LAMPORTS_PER_SOL, PublicKey, Connection, clusterApiUrl, sendAndConfirmTransaction, SystemProgram, Transaction, Cluster } from '@solana/web3.js';
import axios from 'axios';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import bs58 from 'bs58'
import crypto from 'crypto'


interface BountyContextType {
  issuesRepo: any[];
  setIssuesRepo: React.Dispatch<React.SetStateAction<any[]>>;
  addBounty: (bountyAmt: any, issueId: any, issueLink: any, lamports: any, title?: any, transactionId?: any) => Promise<void>;
  approveBounty: (issueId: any, issueLink: any, contributorId: any) => Promise<void>;
  bountyIssues: any[];
  setBountyIssues: React.Dispatch<React.SetStateAction<any[]>>;
  userBountyIssue: any[];
  removeBounty: ({ issueId, issueLink, lamports }: { issueId: string, issueLink: string, lamports: any }) => Promise<void>;
  claimMoney: (contributorId: any, walletAdd: any, bountyAmountInLamports: any, githubId: any, htmlUrl: any) => Promise<void>;
  bountiesCreated: any[];
  bountiesClaimed: any[];
}

type SendSolanaTxProps = {
  walletId: string;
  from: string;
  to: string;
  amount: number;
  network?: 'devnet' | 'mainnet' | 'testnet';
};

const PRIVY_API_URL = 'https://api.privy.io/v1/wallets';

const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');

const BountyDetailsContext = createContext<BountyContextType | undefined>(undefined);

export function BountyContextProvder({ children }: { children: ReactNode }) {
  const [issuesRepo, setIssuesRepo] = useState([]);
  const [bountyIssues, setBountyIssues] = useState<any[]>([]);
  const [userBountyIssue, setUserBountyIssue] = useState<any[]>([]);
  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();
  const [bountiesCreated, setBountiesCreated] = useState<any[]>([]);
  const [bountiesClaimed, setBountiesClaimed] = useState<any[]>([]);
  const [claimBounties, setClaimBounties] = useState<any[]>([]);
  // const { fetchUserMoneyClaimed } = useUserDetails();

  // console.log("public key", publicKey);
  // console.log("connection", connection);

  async function getIssues() {
    try {
      const res = await axios.get(`/api/issues/get`);
      const reposWithIssues = res.data.filter((repo: { issues: string | any[]; }) => repo.issues && repo.issues.length > 0);
      // console.log("res is here", reposWithIssues);
      setIssuesRepo(reposWithIssues);
    } catch (e) {
      console.error("Error while fetching:", e);
    }
  }

  async function getUserBountyIssues(){
    try{
      const res = await axios.get('/api/user/bountyIssues');
      // console.log("here user bounty issue main", res.data.UsersBountyIssues);
      setUserBountyIssue(res.data.UsersBountyIssues);
    } catch(e) {
      console.log("Error fetching user bounty issues");
    }
  }

  async function getBountyIssues() {
    try {
      const res = await axios.get(`${window.location.origin}/api/issues/bounty`);
      setBountyIssues(res.data.BountyIssues);
      // console.log("here user bounty issue", res.data.BountyIssues);
    } catch (e) {
      console.log("Error fetching Bounty Issues", e);
    }
  }

  useEffect(() => {
    getIssues();
    getUserBountyIssues();
    getBountyIssues();
    getBountiesCreated();
    getBountiesClaimed();
    fetchUserMoneyClaimed();

    const interval = setInterval(() => {
      // console.log("calling again and again")
      getBountyIssues();
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  async function addBounty(bountyAmt: any, issueId: any, issueLink: any, lamports: any, title?: any, transactionId?: any) {
    try {
      if(transactionId){

        if (!publicKey) {
          console.error("Wallet not connected");
          alert("Error: Wallet not connected")
          return;
        }  

        const transaction = new Transaction();
        const sendSolInstruction = SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: new PublicKey('6ZDPeVxyRyxQubevCKTM56tUhFq1PRib2BZ66kEp8zrz'),
          lamports: lamports,
        });
  
        transaction.add(sendSolInstruction);
        
        const signature = await sendTransaction(transaction, connection);

        try {
          console.log(`Waiting for transaction confirmation (${signature})...`);
          const commitment = 'confirmed';
          const latestBlockHash = await connection.getLatestBlockhash(commitment);

          const confirmationResult = await connection.confirmTransaction(
              {
                  signature: signature,
                  blockhash: latestBlockHash.blockhash,
                  lastValidBlockHeight: latestBlockHash.lastValidBlockHeight
              },
              commitment
          );

          if (confirmationResult.value.err) {
              alert(`Transaction failed: ${confirmationResult.value.err}`);
              return;
          } else {
              alert(`Transaction ${signature} confirmed with status: ${commitment}`);
              const confirm = await axios.post("/api/bounty/confirm", {
                  bountyAmt,
                  issueId,
                  issueLink,
                  signature,
                  from: publicKey.toString(),
                  lamports,
                  transactionId
              });

              console.log("Backend confirmation response:", confirm);
              setBountyIssues(confirm.data.bountyIssues);
              getIssues();
              getUserBountyIssues();
              getBountiesCreated();
          }
      } catch (error) {
          console.error("Error confirming transaction:", error);
          alert(`Error confirming transaction: ${error || 'Timeout or RPC error'}`);
          return;
      }
      } else {
        if (!publicKey) {
          console.error("Wallet not connected");
          alert("Error: Wallet not connected")
          return;
        }
        
        const add = await axios.post("/api/bounty/add", {
          bountyAmt,
          issueId,
          issueLink,
          lamports: lamports
        });
  
        console.log(add.data.transaction.id)
        const transactionIdd = add.data.transaction.id;
        
        const transaction = new Transaction();
        const sendSolInstruction = SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: new PublicKey('6ZDPeVxyRyxQubevCKTM56tUhFq1PRib2BZ66kEp8zrz'),
          lamports: lamports,
        });
  
        transaction.add(sendSolInstruction);
        
        const signature = await sendTransaction(transaction, connection);
  
        try {
          const commitment = 'confirmed';
          const latestBlockHash = await connection.getLatestBlockhash(commitment);

          const confirmationResult = await connection.confirmTransaction(
              {
                  signature: signature,
                  blockhash: latestBlockHash.blockhash,
                  lastValidBlockHeight: latestBlockHash.lastValidBlockHeight
              },
              commitment
          );

          if (confirmationResult.value.err) {
              alert(`Transaction failed: ${confirmationResult.value.err}`);
              return;
          } else {
              alert(`Transaction ${signature} confirmed with status: ${commitment}`);
              const confirm = await axios.post("/api/bounty/confirm", {
                  bountyAmt,
                  issueId,
                  issueLink,
                  signature,
                  from: publicKey.toString(),
                  lamports,
                  transactionId: transactionIdd
              });

              console.log("Backend confirmation response:", confirm);
              setBountyIssues(confirm.data.bountyIssues);
              getIssues();
              getUserBountyIssues();
          }
      } catch (error) {
          console.error("Error confirming transaction:", error);
          alert(`Error confirming transaction: ${error || 'Timeout or RPC error'}`);
          return;
      }
      }
  } catch(e){
    console.log("Error adding bounty to the issue", e);
  }
  }


  // check vulnerablity here
  async function removeBounty({issueId, issueLink, lamports}: {issueId: string, issueLink: string, lamports: any}){
    // alert(process.env.NEXT_PUBLIC_PRIMARY_WALLET_ADD);
    // alert(process.env.NEXT_PUBLIC_PRIMARY_WALLET_PRIVATE_KEY);
    // alert(`now here ${lamports}`);

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
      
      // console.log("remove log", remove);
      
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

        // console.log("Transaction Signature:", signature);

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
    // console.log("here reached here", issueId, issueLink, contributorId);
    // approved
    try{
      const res = await axios.post("/api/bounty/approve", {
        issueId,
        issueLink,
        contributorId
      });

      // console.log("after approving", res);

      getIssues();
      getUserBountyIssues();
    } catch(e){
      console.log("Error while approving the transaction");
    }
  }


  // user claiming money
  async function claimMoney(contributorId: any, walletAdd: any, bountyAmountInLamports: any, githubId: any, htmlUrl: any){
      try {
    if(!process.env.NEXT_PUBLIC_PRIMARY_WALLET_ADD){
      return console.error("PRIMARY_WALLET_ADD public key not available");
    }
    if(!process.env.NEXT_PUBLIC_PRIMARY_WALLET_PRIVATE_KEY){
      return console.error("PRIMARY_WALLET_ADD private key not available");
    }

    const claiming = await axios.post("/api/user/claim/pending", {
        contributorId,
        walletAdd,
        bountyAmountInLamports,
        githubId,
        htmlUrl
    });

    const transactionIdd = claiming.data.transaction.id;

    const keypair = Keypair.fromSecretKey(bs58.decode(process.env.NEXT_PUBLIC_PRIMARY_WALLET_PRIVATE_KEY));
    
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: keypair.publicKey,
        toPubkey: walletAdd,
        lamports: bountyAmountInLamports,
      })
    );

    const signature = await sendAndConfirmTransaction(
      connection,
      transaction,
      [keypair]
    );

    try {
      console.log(`Waiting for transaction confirmation (${signature})...`);
      const commitment = 'confirmed';
      const latestBlockHash = await connection.getLatestBlockhash(commitment);

      const confirmationResult = await connection.confirmTransaction(
          {
              signature: signature,
              blockhash: latestBlockHash.blockhash,
              lastValidBlockHeight: latestBlockHash.lastValidBlockHeight
          },
          commitment
      );

      if (confirmationResult.value.err) {
          alert(`Transaction failed: ${confirmationResult.value.err}`);
          return;
      } else {
        alert(`Transaction ${signature} confirmed with status: ${commitment}`);
        const claimConfirm = await axios.post("/api/user/claim/approve", {
          transactionId: transactionIdd,
          to: walletAdd,
          signature: signature,
          lamports: bountyAmountInLamports,
          issueLink: htmlUrl,
          issueId: githubId
        });

        console.log("claim confirm", claimConfirm);
    
        getBountiesCreated();
        getBountiesClaimed();    
        fetchUserMoneyClaimed();
      }
    } catch (error) {
      console.log("Error confirming transaction:", error);
      alert(`Error confirming transaction: ${error || 'Timeout or RPC error'}`);
      return;
    } 
        
      } catch (error) {
        console.log("Claiming bounty error", error);
      }
      }

  async function fetchUserMoneyClaimed(){
    const res = await axios.get("/api/user/claim");
    // console.log("fetchUserMoneyClaimed", res.data.claimBounties);
    setClaimBounties(res.data.claimBounties);
  };

  // created bounties
  async function getBountiesCreated(){
    const res = await axios.get('/api/user/transaction/created');
    // console.log("bounties createdd", res.data);
    setBountiesCreated(res.data.data);
  }

  // claimed bounties
  async function getBountiesClaimed(){
    const res = await axios.get('/api/user/transaction/claimed');
    // console.log("bounties claimed", res.data);
    setBountiesClaimed(res.data.data);
  }
  return (
    // @ts-ignore
    <BountyDetailsContext.Provider value={{ issuesRepo, setIssuesRepo, addBounty, bountyIssues, setBountyIssues, userBountyIssue, removeBounty, approveBounty, claimMoney, bountiesCreated, bountiesClaimed, claimBounties, withdrawMoney}}>
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

