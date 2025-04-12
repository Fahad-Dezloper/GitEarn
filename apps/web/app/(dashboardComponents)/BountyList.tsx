"use client"
import { motion } from "motion/react"
import React from 'react'
import { LuExternalLink } from "react-icons/lu";
import { VscGithubInverted } from "react-icons/vsc";
import { Badge } from "@/components/ui/badge";
import Link from 'next/link';

const BountyList = () => {
    const bounties = [
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
  return (
    <div className="w-full grid grid-cols-3 gap-4">
        {bounties.map((bounty, index) => (
         <motion.div
         key={bounty.title}
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ duration: 0.5, delay: index * 0.1 }}
         className="group relative bg-white dark:bg-transparent rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 backdrop-blur-sm"
       >
         <div className="py-6 relative z-10 flex flex-col h-full">
           
           {/* TITLE + TAGS */}
           <div className="mb-4 ">
             <div className="flex flex-col items-start justify-between gap-2">
                {/* REPO PATH */}
                <div className="w-full flex pl-6 justify-between items-center">
                <p className="text-sm text-gray-600 dark:text-gray-300">
             {bounty.repo}
           </p>
                <Badge className=" border px-2 py-1.5 rounded-l-full text-sm">🕒 {bounty.posted}</Badge>
                </div>
               <h3 className="text-xl px-6 font-semibold text-gray-900 dark:text-white">
                 {bounty.title}
               </h3>
               <div className="flex flex-wrap px-6 gap-1 w-full justify-end">
                 {bounty.tags.map((tag, i) => (
                   <Badge 
                   variant="outline" 
                   key={i} 
                   className='text-[#007AFF] dark:text-[#00D1FF] 
                       border-[#007AFF]/20 dark:border-[#00D1FF]/20
                       bg-[#007AFF]/5 dark:bg-[#00D1FF]/5
                       text-xs px-2 py-0.5 rounded-full
                       group-hover:bg-[#007AFF]/10 dark:group-hover:bg-[#00D1FF]/10
                       transition-colors'
               >
                   {tag}
               </Badge>
                 ))}
               </div>
             </div>
           </div>
       
           {/* META INFO ROW */}
           <div className="flex items-center px-6 justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
           <div className="flex gap-2 mt-auto">
             {/* {bounty.github && ( */}
               <Link
                 href={"/"}
                 target="_blank"
                 className="text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700/50"
               >
                 <VscGithubInverted size={20} />
               </Link>
             {/* )} */}
             {/* {bounty.link && ( */}
               <Link
                 href={'/'}
                 target="_blank"
                 className="text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700/50"
               >
                 <LuExternalLink size={20} />
               </Link>
             {/* )} */}
           </div>
             <div className="text-[#14F195] font-sora dark:text-[#14F195] text-xl font-bold">
               ${bounty.amount}
             </div>
           </div>
       
         </div>
       
         {/* HOVER EFFECT */}
         {/* group-hover:opacity-100 */}
         <div className="absolute inset-0 bg-gradient-to-t from-blue-500/10 to-transparent opacity-100  transition-opacity duration-300 pointer-events-none" />
       </motion.div>       
        ))}
        </div>
  )
}

export default BountyList