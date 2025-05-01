/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import axios from 'axios';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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
    } catch (e) {
      console.log("Error fetching Bounty Issues", e);
    }
  }

  useEffect(() => {
    getIssues();
    getUserBountyIssues();
    getBountyIssues();

    const interval = setInterval(() => {
      // console.log("calling again and again")
      getBountyIssues();
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  async function addBounty(bountyAmt: any, issueId: any, issueLink: any, title: any) {

    // make solana transaction here before db call

    try {
      const res = await axios.post("/api/bounty/add", {
      bountyAmt,
      issueId,
      issueLink,  
      title,
    });

    setBountyIssues(res.data.bountyIssues);
    getIssues();
    getUserBountyIssues();
  } catch(e){
    console.log("Error adding bounty to the issue");
  }
  }

  async function removeBounty({issueId, issueLink}: {issueId: string, issueLink: string}){
    
    // wallet call
    try {
      const res = await axios.delete("/api/bounty/remove", {
        headers: { 'Content-Type': 'application/json' },
        data: {
          issueId: issueId,
          issueLink: issueLink,
        }
      });

      getIssues();
      getUserBountyIssues();
    } catch (error) {
      console.log("in context provider cancel bounty error"); 
    }
  }
    // console.log(res);

  async function ApproveBounty(bountyAmt: any, issueId: any, issueLink: any, title: any){
    const res = await axios.post("/api/bounty/approve", {
      bountyAmt,
      issueId,
      issueLink,
      title,
    });
  }

  return (
    // @ts-ignore
    <BountyDetailsContext.Provider value={{ issuesRepo, setIssuesRepo, addBounty, bountyIssues, setBountyIssues, userBountyIssue, removeBounty}}>
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
