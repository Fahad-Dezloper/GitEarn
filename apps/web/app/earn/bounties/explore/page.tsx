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
  const [tagList, setTaglist] = useState<string[]>([]);
  const [activeFilters, setActiveFilters] = useState({
    title: "",
    tags: [] as string[],
    minAmount: 0,
    minStars: 0,
    posted: "7"
  });

  useEffect(() => {
    const tags = [...new Set(bountyIssues.flatMap((b) => b.tags))];
    setTaglist(tags);
    setFilteredBounties(bountyIssues);
  }, [bountyIssues]);

  function handleFilter(filters: any) {
    if (filters.reset) {
      setActiveFilters({
        title: "",
        tags: [],
        minAmount: 0,
        minStars: 0,
        posted: "7"
      });
      setFilteredBounties(bountyIssues);
      return;
    }
    
    const updatedFilters = { ...activeFilters, ...filters };
    setActiveFilters(updatedFilters);
    
    const filtered = bountyIssues.filter((bounty) => {
      const matchesTitle = bounty.title.toLowerCase().includes(updatedFilters.title.toLowerCase());
      const matchesTags = updatedFilters.tags.length === 0 || 
                         updatedFilters.tags.every((tag: string) => bounty.tags.includes(tag));
      const matchesAmount = bounty.amount >= updatedFilters.minAmount;
      const matchesStars = bounty.stars >= updatedFilters.minStars;
  
      let matchesPosted = true;
      if (updatedFilters.posted !== "any") {
        const postedDaysAgo = parsePostedDays(bounty.posted);
        matchesPosted = postedDaysAgo <= parseInt(updatedFilters.posted);
      }
  
      return matchesTitle && matchesTags && matchesAmount && matchesStars && matchesPosted;
    });
  
    setFilteredBounties(filtered);
  }

  function parsePostedDays(postedString: string) {
    const num = parseInt(postedString);
    if (postedString.includes("day")) return num;
    if (postedString.includes("week")) return num * 7;
    if (postedString.includes("month")) return num * 30;
    return 999;
  }

  return (
    <div className="flex flex-col gap-6 py-4">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-sora font-semibold">GitHub Bounty Board</h1>
        <p className="text-muted-foreground">
          Discover open issues with bounties from GitHub repositories
        </p>
      </div>

      {/* Filters */}
      {/* <div className="sticky top-6">
        <BountyFilter 
          tagList={tagList} 
          onFilter={handleFilter} 
          activeFilters={activeFilters}
        />
      </div> */}

      {/* List */}
      <BountyList bounties={filteredBounties} />
    </div>
  );
}