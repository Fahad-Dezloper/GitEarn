'use client'
import axios from 'axios';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

const BountyDetailsContext = createContext(undefined);

export function BountyContextProvder({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(false);
  const [issuesRepo, setIssuesRepo] = useState([]);
  const [bountyIssues, setBountyIssues] = useState([]);

  async function getIssues() {
    try {
      const res = await axios.get(`/api/issues/get`);
      setIssuesRepo(res.data);
    } catch (e) {
      console.error("Error while fetching:", e);
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

    const interval = setInterval(() => {
      console.log("calling again and again")
      getBountyIssues();
    }, 15000); // 15 seconds

    return () => clearInterval(interval); // Cleanup on unmount
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
    <BountyDetailsContext.Provider value={{ issuesRepo, setIssuesRepo, addBounty, bountyIssues, setBountyIssues }}>
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
