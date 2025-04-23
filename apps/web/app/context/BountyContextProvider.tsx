'use client'
import axios from 'axios';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

const BountyDetailsContext = createContext(undefined);

export function BountyContextProvder({children}: {children: ReactNode}){
    const [loading, setLoading] = useState(false);
    const [issuesRepo, setIssuesRepo] = useState([]);
    const [bountyIssues, setBountyIssues] = useState([]);


    async function getIssues() {
      try {
        const res = await axios.get(`/api/issues/get`);
        // console.log("issues data", res.data);
        setIssuesRepo(res.data);
      } catch (e) {
        console.error("Error while fetching:", e);
      }
    }

    async function getBountyIssues(){
      try {
        const res = await axios.get('/api/issues/bounty');
        // console.log("issue bounty data", res.data.BountyIssues);
        setBountyIssues(res.data.BountyIssues);
      } catch (e) {
        console.log("Error fetching Bounty Issues", e);
      }
    }

    useEffect(() => {
        getIssues();
        getBountyIssues();
      }, []);

      async function addBounty(bountyAmt, issueId, issueLink, title){
        const res = await axios.post("/api/bounty/add", {
          bountyAmt,
          issueId,
          issueLink,
          title,
        })

        console.log("response form post", res);
        setBountyIssues(res.data.bountyIssues);
      };

    return (
        <BountyDetailsContext.Provider value={{issuesRepo, setIssuesRepo, addBounty, bountyIssues, setBountyIssues}}>
        {children}
    </BountyDetailsContext.Provider>
    )
}

export function useBountyDetails() {
    const context = useContext(BountyDetailsContext);
    if (context === undefined) {
        throw new Error('useBountyDetails must be used within a BountyContextProvder');
    }
    return context;
}