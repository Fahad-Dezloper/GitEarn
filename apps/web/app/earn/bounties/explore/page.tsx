/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"
import BountyList from "@/app/(dashboardComponents)/BountyList"
import BountyFilter from "@/app/(dashboardComponents)/BountyFIlter"
import { useEffect, useState } from "react"
import { useBountyDetails } from "@/app/context/BountyContextProvider";
import Topbar from "@/app/(dashboardComponents)/Topbar";

export default function Page() {
  
  const { bountyIssues, setBountyIssues } = useBountyDetails() as {
    bountyIssues: any[];
    setBountyIssues: (bounties: any[]) => void;
  };
  
  const [filteredBounties, setFilteredBounties] = useState(bountyIssues);

  return (
    <div>
      <Topbar />
    <div className="flex flex-col gap-4 sm:gap-6 py-3 sm:py-4">
      <div className="flex flex-col gap-1 sm:gap-2">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-sora font-semibold">GitHub Bounty Board</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Discover open issues with bounties from GitHub repositories
        </p>
      </div>

      <div className="w-full">
        <BountyFilter 
          originalBounties={bountyIssues}
          onFilterChange={setFilteredBounties} 
        />
      </div>

      {/* List */}
      <div className="w-full">
        <BountyList bounties={filteredBounties} />
      </div>
    </div>
    </div>
  );
}