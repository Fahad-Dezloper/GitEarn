'use client'
import axios from 'axios';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

const BountyDetailsContext = createContext(undefined);

export function BountyContextProvder({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(false);
  const [issuesRepo, setIssuesRepo] = useState([]);
  const [bountyIssues, setBountyIssues] = useState([]);
  const [userBountyIssue, setUserBountyIssue] = useState([]);

  async function getIssues() {
    try {
      const res = await axios.get(`/api/issues/get`);
      // console.log("res data", res.data);
      const reposWithIssues = res.data.filter(repo => repo.issues && repo.issues.length > 0);
      // console.log("data", reposWithIssues);
      setIssuesRepo(reposWithIssues);
    } catch (e) {
      console.error("Error while fetching:", e);
    }
  }

  async function getUserBountyIssues(){
    try{
      const res = await axios.get('/api/user/bountyIssues');
      // console.log("users personal issue", res.data);
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

  async function addBounty(bountyAmt, issueId, issueLink, title) {

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

  async function removeBounty({issueId, issueLink}){
    
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

  async function ApproveBounty(bountyAmt, issueId, issueLink, title){
    const res = await axios.post("/api/bounty/approve", {
      bountyAmt,
      issueId,
      issueLink,
      title,
    });
  }

  return (
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
