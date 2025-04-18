/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import BountyList from "@/app/(dashboardComponents)/BountyList"
import BountyFilter from "@/app/(dashboardComponents)/BountyFIlter"
import { useEffect, useState } from "react"

export default function Page() {
  
  const Allbounties = [
    {
      title: "Fix pagination in documentation search",
      repo: "github/docs-platform",
      amount: 500,
      tags: ["JavaScript", "React", "TypeScript"],
      stars: 1254,
      forks: 245,
      posted: "2 days ago",
    },
    {
      title: "Implement WebSocket reconnection logic",
      repo: "socketio/socket-engine",
      amount: 1200,
      tags: ["TypeScript", "Node.js"],
      stars: 893,
      forks: 125,
      posted: "1 week ago",
    },
    {
      title: "Fix memory leak in worker thread pool",
      repo: "workerthreads/thread-runner",
      amount: 800,
      tags: ["C++", "Node.js"],
      stars: 567,
      forks: 89,
      posted: "3 weeks ago",
    },
    {
      title: "Optimize database query for large datasets",
      repo: "postgres-tools/data-layer",
      amount: 2500,
      tags: ["SQL", "Python", "TypeScript"],
      stars: 2453,
      forks: 342,
      posted: "1 month ago",
    },
    {
      title: "Add dark mode support to UI components",
      repo: "ui-components/design-system",
      amount: 350,
      tags: ["CSS", "React", "TypeScript"],
      stars: 1876,
      forks: 278,
      posted: "5 days ago",
    },
    {
      title: "Implement CI/CD pipeline for Rust project",
      repo: "rust-tools/cargo-deploy",
      amount: 750,
      tags: ["Rust", "GitHub Actions"],
      stars: 3421,
      forks: 467,
      posted: "2 weeks ago",
    },
    // 10 additional random ones
    {
      title: "Create OAuth2 integration for API gateway",
      repo: "auth-tools/oauth-gateway",
      amount: 1000,
      tags: ["Go", "OAuth2"],
      stars: 1420,
      forks: 192,
      posted: "4 days ago",
    },
    {
      title: "Build markdown parser with live preview",
      repo: "editor-tools/md-preview",
      amount: 650,
      tags: ["JavaScript", "HTML", "CSS"],
      stars: 980,
      forks: 110,
      posted: "1 week ago",
    },
    {
      title: "Add i18n support to dashboard",
      repo: "dashboard/core-ui",
      amount: 400,
      tags: ["React", "TypeScript", "i18next"],
      stars: 2210,
      forks: 332,
      posted: "6 days ago",
    },
    {
      title: "Integrate Stripe for subscription billing",
      repo: "payments/stripe-integration",
      amount: 1300,
      tags: ["Node.js", "Stripe", "Express"],
      stars: 1570,
      forks: 287,
      posted: "3 days ago",
    },
    {
      title: "Refactor legacy PHP codebase to Laravel",
      repo: "legacy-migration/php-laravel",
      amount: 1100,
      tags: ["PHP", "Laravel"],
      stars: 780,
      forks: 85,
      posted: "2 weeks ago",
    },
    {
      title: "Implement offline sync for mobile app",
      repo: "mobile-tools/sync-service",
      amount: 1700,
      tags: ["Flutter", "Firebase"],
      stars: 1340,
      forks: 203,
      posted: "1 week ago",
    },
    {
      title: "Add unit tests for core algorithms",
      repo: "algorithms/core",
      amount: 300,
      tags: ["Python", "PyTest"],
      stars: 1890,
      forks: 240,
      posted: "3 days ago",
    },
    {
      title: "Build custom WebRTC signaling server",
      repo: "rtc/signal-server",
      amount: 2000,
      tags: ["WebRTC", "Node.js", "Socket.IO"],
      stars: 980,
      forks: 121,
      posted: "5 days ago",
    },
    {
      title: "Set up Docker-based local dev environment",
      repo: "dev-env/docker-setup",
      amount: 550,
      tags: ["Docker", "DevOps"],
      stars: 1345,
      forks: 162,
      posted: "1 week ago",
    }
  ];

  const [bounties, setBounties] = useState(Allbounties)
  const [tagList, setTaglist] = useState<string[]>([])

  useEffect(() => {
    const tags = [...new Set(Allbounties.flatMap((b) => b.tags))]
    setTaglist(tags)
  }, [])

  function handleFilter(filters: any) {
    if (filters.reset) {
      setBounties(Allbounties)
      return
    }
  
    const {
      title = "",
      tags = [],
      minAmount = 0,
      minStars = 0,
      posted = "7"
    } = filters
  
    const filtered = Allbounties.filter((bounty) => {
      const matchesTitle = bounty.title.toLowerCase().includes(title.toLowerCase())
      const matchesTags = tags.length === 0 || tags.every((tag: string) => bounty.tags.includes(tag))
      const matchesAmount = bounty.amount >= minAmount
      const matchesStars = bounty.stars >= minStars
  
      let matchesPosted = true
      if (posted !== "any") {
        const postedDaysAgo = parsePostedDays(bounty.posted)
        matchesPosted = postedDaysAgo <= parseInt(posted)
      }
  
      return matchesTitle && matchesTags && matchesAmount && matchesStars && matchesPosted
    })
  
    setBounties(filtered)
  }

  function parsePostedDays(postedString: string) {
    const num = parseInt(postedString)
    if (postedString.includes("day")) return num
    if (postedString.includes("week")) return num * 7
    if (postedString.includes("month")) return num * 30
    return 999 // fallback
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
      <div className="lg:sticky lg:top-20">
        <BountyFilter tagList={tagList} onFilter={handleFilter} />
      </div>

      {/* List */}
      <BountyList bounties={bounties} />
    </div>
  )
}
