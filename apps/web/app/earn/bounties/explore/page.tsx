/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"
import BountyList from "@/app/(dashboardComponents)/BountyList"
import BountyFilter from "@/app/(dashboardComponents)/BountyFIlter"
import { useEffect, useState } from "react"
import { useBountyDetails } from "@/app/context/BountyContextProvider";

export default function Page() {
  
  const { bountyIssues, setBountyIssues } = useBountyDetails() as {
    bountyIssues: any[];
    setBountyIssues: (bounties: any[]) => void;
  };
  
  const [filteredBounties, setFilteredBounties] = useState(bountyIssues);

  return (
    <div className="flex flex-col gap-6 py-4">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-sora font-semibold">GitHub Bounty Board</h1>
        <p className="text-muted-foreground">
          Discover open issues with bounties from GitHub repositories
        </p>
      </div>

    <BountyFilter originalBounties={bountyIssues}
  onFilterChange={setFilteredBounties} />

      {/* List */}
      <BountyList bounties={filteredBounties} />
    </div>
  );
}