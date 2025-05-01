/* eslint-disable @next/next/no-img-element */
import ExploreButton from '@/components/fancyComponents/page';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Sparkles } from 'lucide-react';
import React from 'react'

const SuggestedBounties = () => {
    const getTimeAgo = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        const weeks = Math.floor(days / 7);
        const months = Math.floor(days / 30);

        if (months > 0) return `${months} ${months === 1 ? 'month' : 'months'} ago`;
        if (weeks > 0) return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
        if (days > 0) return `${days} ${days === 1 ? 'day' : 'days'} ago`;
        if (hours > 0) return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
        if (minutes > 0) return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
        return 'just now';
    };

    const githubIssues = [
        {
          title: "Fix login authentication bug",
          repoName: "auth-service",
          bountyAmount: 15 + 'k',
          postedDate: "2024-03-25",
          orgLogo: "https://avatars.githubusercontent.com/u/158404377?s=200&v=4",
          techStack: ["Node.js", "Express", "MongoDB"],
        },
        {
          title: "Improve database indexing",
          repoName: "db-optimizer",
          bountyAmount: 200,
          postedDate: "2024-03-27",
          orgLogo: "https://avatars.githubusercontent.com/u/8079861?v=4",
          techStack: ["Python", "PostgreSQL", "SQLAlchemy"],
        },
        {
          title: "Update frontend UI components",
          repoName: "ui-kit",
          bountyAmount: 100,
          postedDate: "2024-03-28",
          orgLogo: "https://avatars.githubusercontent.com/u/8079861?v=4",
          techStack: ["React", "TypeScript", "TailwindCSS"],
        },
        {
          title: "Enhance API security measures",
          repoName: "api-gateway",
          bountyAmount: 300,
          postedDate: "2024-03-29",
          orgLogo: "https://avatars.githubusercontent.com/u/8079861?v=4",
          techStack: ["Go", "GraphQL", "Docker"],
        },
        {
          title: "Refactor legacy payment module",
          repoName: "payment-service",
          bountyAmount: 250,
          postedDate: "2024-04-01",
          orgLogo: "https://avatars.githubusercontent.com/u/8079861?v=4",
          techStack: ["Java", "Spring Boot", "MySQL"],
        },
        {
          title: "Optimize React performance",
          repoName: "frontend-optimizations",
          bountyAmount: 180,
          postedDate: "2024-04-02",
          orgLogo: "https://avatars.githubusercontent.com/u/8079861?v=4",
          techStack: ["React", "Redux", "Webpack"],
        },
        {
          title: "Add dark mode support",
          repoName: "design-system",
          bountyAmount: 120,
          postedDate: "2024-04-03",
          orgLogo: "https://avatars.githubusercontent.com/u/8079861?v=4",
          techStack: ["Vue.js", "SCSS", "Vite"],
        },
        {
          title: "Implement caching strategy",
          repoName: "server-optimization",
          bountyAmount: 220,
          postedDate: "2024-04-04",
          orgLogo: "https://avatars.githubusercontent.com/u/8079861?v=4",
          techStack: ["Redis", "Node.js", "AWS Lambda"],
        },
        {
          title: "Fix memory leak in API",
          repoName: "backend-core",
          bountyAmount: 260,
          postedDate: "2024-04-05",
          orgLogo: "https://avatars.githubusercontent.com/u/8079861?v=4",
          techStack: ["Django", "Python", "Celery"],
        },
        {
          title: "Write unit tests for user module",
          repoName: "user-service",
          bountyAmount: 130,
          postedDate: "2024-04-06",
          orgLogo: "https://avatars.githubusercontent.com/u/8079861?v=4",
          techStack: ["Jest", "TypeScript", "Next.js"],
        },
        {
          title: "Migrate database to PostgreSQL",
          repoName: "db-migration",
          bountyAmount: 280,
          postedDate: "2024-04-07",
          orgLogo: "https://avatars.githubusercontent.com/u/8079861?v=4",
          techStack: ["PostgreSQL", "Knex.js", "Docker"],
        },
        {
          title: "Fix UI responsiveness issues",
          repoName: "mobile-ui",
          bountyAmount: 160,
          postedDate: "2024-04-08",
          orgLogo: "https://avatars.githubusercontent.com/u/8079861?v=4",
          techStack: ["React Native", "Expo", "Styled Components"],
        },
        {
          title: "Add WebSocket support",
          repoName: "real-time-chat",
          bountyAmount: 300,
          postedDate: "2024-04-09",
          orgLogo: "https://avatars.githubusercontent.com/u/8079861?v=4",
          techStack: ["Socket.io", "Node.js", "Redis"],
        },
        {
          title: "Improve accessibility (WCAG)",
          repoName: "web-accessibility",
          bountyAmount: 180,
          postedDate: "2024-04-10",
          orgLogo: "https://avatars.githubusercontent.com/u/8079861?v=4",
          techStack: ["HTML", "CSS", "JavaScript"],
        },
        {
          title: "Add multi-language support",
          repoName: "i18n-project",
          bountyAmount: 190,
          postedDate: "2024-04-11",
          orgLogo: "https://avatars.githubusercontent.com/u/8079861?v=4",
          techStack: ["React", "i18next", "JSON"],
        },
        {
          title: "Upgrade dependency versions",
          repoName: "dependency-updater",
          bountyAmount: 110,
          postedDate: "2024-04-12",
          orgLogo: "https://avatars.githubusercontent.com/u/8079861?v=4",
          techStack: ["Node.js", "NPM", "GitHub Actions"],
        },
        {
          title: "Add GraphQL support",
          repoName: "graphql-service",
          bountyAmount: 250,
          postedDate: "2024-04-13",
          orgLogo: "https://avatars.githubusercontent.com/u/8079861?v=4",
          techStack: ["GraphQL", "Apollo Server", "Prisma"],
        },
        {
          title: "Implement CI/CD pipeline",
          repoName: "devops-automation",
          bountyAmount: 270,
          postedDate: "2024-04-14",
          orgLogo: "https://avatars.githubusercontent.com/u/8079861?v=4",
          techStack: ["GitHub Actions", "Docker", "Kubernetes"],
        },
        {
          title: "Build a CLI tool for automation",
          repoName: "cli-tool",
          bountyAmount: 220,
          postedDate: "2024-04-15",
          orgLogo: "https://avatars.githubusercontent.com/u/8079861?v=4",
          techStack: ["Go", "Cobra", "Docker"],
        },
        {
          title: "Fix OAuth authentication flow",
          repoName: "oauth-integration",
          bountyAmount: 310,
          postedDate: "2024-04-16",
          orgLogo: "https://avatars.githubusercontent.com/u/8079861?v=4",
          techStack: ["OAuth2", "JWT", "Express"],
        },
      ];
            
    const suggestedBounties = githubIssues.slice(0, 3);
  return (
    <div className='flex flex-col gap-3'>
                    <div className='flex items-center justify-between'>
                        <div className='flex items-center gap-2'>
                            <Sparkles className='w-5 h-5 text-[#007AFF] dark:text-[#00D1FF]' />
                            <h2 className='text-xl font-semibold text-gray-800 dark:text-gray-100'>Suggested for You</h2>
                        </div>
                        <div className='flex items-center gap-2'>
                            <ExploreButton text='Explore all bounties' link='/bounty' />
                            <ArrowRight className='w-4 h-4 text-gray-500 dark:text-gray-400' />
                        </div>
                    </div>
                    <div className='w-full flex flex-col gap-3'>
                        {suggestedBounties.map((issue, i) => (
                            <div 
                                key={i} 
                                className='relative flex w-full flex-col p-4 rounded-xl 
                                    bg-white dark:bg-transparent border border-gray-200 dark:hover:bg-blue-100/20 dark:border-gray-800 
                                    hover:shadow-md hover:border-[#007AFF]/20 dark:hover:border-[#00D1FF]/20
                                    transition-all duration-300 cursor-pointer group'
                            >
                                <div className='flex items-start justify-between gap-4'>
                                    <div className='flex gap-4'>
                                        <div className='relative'>
                                            <img 
                                                src={issue.orgLogo} 
                                                alt="" 
                                                className='w-14 h-14 rounded-full border-2 border-gray-200 dark:border-gray-700 
                                                    group-hover:border-[#007AFF] dark:group-hover:border-[#00D1FF] transition-colors' 
                                            />
                                        </div>
                                        <div className='flex flex-col gap-2'>
                                            <div className='text-gray-800 dark:text-gray-100 text-lg font-semibold 
                                                group-hover:text-[#007AFF] dark:group-hover:text-[#00D1FF] transition-colors'>
                                                {issue.title}
                                            </div>
                                            <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                                                <span className='font-medium'>{issue.repoName}</span>
                                                <span className='w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600' />
                                                <span>{getTimeAgo(issue.postedDate)}</span>
                                                <span className='w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600' />
                                                <div className='flex items-center gap-2'>
                                                {issue.techStack.slice(0, 2).map((item, i) => (
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
                                                        {item}
                                                    </Badge>
                                                ))}
                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='flex flex-col items-end gap-2'>
                                        <div className='text-[#14F195] font-sora dark:text-[#14F195] text-xl font-bold'>
                                            {issue.bountyAmount} <span className="font-normal text-gray-400 text-sm">USDC</span>
                                        </div>
                                        <div className='text-xs text-gray-500 dark:text-gray-400'>
                                            Bounty
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
  )
}

export default SuggestedBounties