"use client";
import { motion } from "motion/react"
import { LuExternalLink } from "react-icons/lu";
import { VscGithubInverted } from "react-icons/vsc";
import Link from 'next/link';
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import BountyList from "@/app/(dashboardComponents)/BountyList";
import BountyFIlter from "@/app/(dashboardComponents)/BountyFIlter";

export default function Page({ params: { name: string } }) {
    // const { params } = await props;

      const [filters, setFilters] = useState({
        minAmount: 0,
        maxAmount: 10000,
        selectedTechs: [] as string[],
      });
    
      const handleFilterChange = (newFilters: {
        minAmount: number;
        maxAmount: number;
        selectedTechs: string[];
      }) => {
        setFilters(newFilters);
      };
      
    return <div className="flex flex-col gap-6 py-4">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-sora font-semibold">GitHub Bounty Board</h1>
        <p className="text-muted-foreground">
            Discover open issues with bounties from GitHub repositories
          </p>
          </div>
        {/* filters */}
        
        <div className="lg:sticky lg:top-20">
              <BountyFIlter onFilterChange={handleFilterChange} />
            </div>




        <BountyList />
    </div>
}