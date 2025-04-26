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
    getBountyIssues();
    getUserBountyIssues();

    const interval = setInterval(() => {
      // console.log("calling again and again")
      getBountyIssues();
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  async function addBounty(bountyAmt, issueId, issueLink, title) {
    const res = await axios.post("/api/bounty/add", {
      bountyAmt,
      issueId,
      issueLink,
      title,
    });

    setBountyIssues(res.data.bountyIssues);
  }

  return (
    <BountyDetailsContext.Provider value={{ issuesRepo, setIssuesRepo, addBounty, bountyIssues, setBountyIssues, userBountyIssue}}>
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
