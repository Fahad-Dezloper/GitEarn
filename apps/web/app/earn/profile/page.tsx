"use client"
import { useUserDetails } from '@/app/context/UserDetailsProvider'
import Image from 'next/image';
import React, { ReactNode } from 'react';
import GitHubCalendar from 'react-github-calendar'
import languageColors from 'github-language-colors';
import { Separator } from "@/components/ui/separator"
import UserBountyDets from '@/app/(dashboardComponents)/UserBountyDets';
import UserIssuesSolved from '@/app/(dashboardComponents)/UserIssuesSolved';
import AddWallet from '@/app/(dashboardComponents)/AddWallet';
import Topbar from '@/app/(dashboardComponents)/Topbar';


const Page = () => {
  const { userDetailss, wakaTimeDetails } = useUserDetails();
  
  return (
    <div className="w-full h-full md:px-2 !overflow-hidden">
    <Topbar />
    {/* w-full h-full flex md:flex-row flex-col gap-8 py-6 */}
    <div className='w-full h-full !overflow-hidden py-6'>
        {/* Profile Header */}
        <div className='flex md:flex-row flex-col md:items-start gap-4 md:gap-6 md:mb-8'>
          <div className='flex items-start gap-4'>
          <div className='w-24 h-24 md:w-32 md:h-32 rounded-full border-2 border-white overflow-hidden relative'>
            <Image 
              src={userDetailss.avatar_url ?? '/default-avatar.png'} 
              alt="User Avatar" 
              fill 
              className="object-cover"
            />
          </div>
          
          {/* User Info */}
          <div className='flex flex-col items-start md:items-start gap-2'>
            <h1 className='text-xl md:text-2xl font-bold text-center md:text-left'>{userDetailss.name || userDetailss.login}</h1>
            <p className='text-gray-600 dark:text-gray-400'>@{userDetailss.login}</p>
          </div>
          </div>

          <div className="flex md:hidden">
            <UserBountyDets />
            </div>

        </div>

        {/* Main Content */}
        <div className='flex flex-col lg:flex-row justify-between gap-6'>
          {/* Left Column */}
          <div className='flex flex-col gap-6 py-4 w-full lg:w-[60%]'>
            {/* Profile Information */}
            <div className='px-2 md:px-6 bg-card rounded-lg p-4 shadow-sm'>
              <h2 className='text-xl font-semibold font-sora mb-4'>Profile Information</h2>
              <div className='space-y-4'>
                {userDetailss.bio && (
                  <div>
                    <p className='text-gray-600 dark:text-gray-400 font-sora'>Bio</p>
                    <p className='mt-1'>{userDetailss.bio}</p>
                  </div>
                )}
                <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
                  <div>
                    <p className='text-gray-600 dark:text-gray-400 font -sora'>Location</p>
                    <p className='mt-1'>{userDetailss.location || 'Not specified'}</p>
                  </div>
                  <div>
                    <p className='text-gray-600 dark:text-gray-400 font-sora'>Repositories</p>
                    <p className='mt-1'>{userDetailss.public_repos || 0}</p>
                  </div>
                  <div>
                    <p className='text-gray-600 dark:text-gray-400 font-sora'>Followers</p>
                    <p className='mt-1'>{userDetailss.followers || 0} followers</p>
                  </div>
                </div>
              </div>
            </div>

            {/* GitHub Stats */}
            <div className='px-2 md:px-6 bg-card rounded-lg p-4 shadow-sm'>
              <h2 className='text-xl font-sora font-semibold mb-4'>GitHub Stats</h2>
              {wakaTimeDetails?.wakatime_raw && (
                <div className='space-y-4'>
                  <div>
                    <p className='text-gray-600 dark:text-gray-400 font-sora'>Total Coding Time (Last 7 Days)</p>
                    <p className='text-lg font-medium mt-1'>
                      {wakaTimeDetails.wakatime_raw.human_readable_total || 'N/A'}
                    </p>
                  </div>

                  <div className="flex flex-col gap-2">
                    <p className='text-gray-600 dark:text-gray-400 font-sora'>Top Languages</p>
                    <ul className='flex flex-wrap items-center gap-3'>
                      {wakaTimeDetails.wakatime_raw.languages?.slice(0, 3).map((lang: {
                        text: ReactNode; name: string 
                        }, index: React.Key | null | undefined) => (
                        <li
                          key={index}
                          className="group relative flex items-center space-x-2 cursor-default"
                        >
                          <span
                            className="h-2 w-10 rounded-full"
                            style={{ backgroundColor: languageColors[String(lang.name) as keyof typeof languageColors] || '#ccc' }}
                          ></span>

                          <span className="text-sm text-gray-800 dark:text-gray-200">{lang.name}</span>

                          <div className="absolute left-1/2 -translate-x-1/2 -top-8 scale-95 opacity-0 group-hover:opacity-100 group-hover:scale-100 transition-all duration-200 bg-gray-900 text-white text-xs px-2 py-1 rounded shadow z-10 whitespace-nowrap pointer-events-none dark:bg-gray-800">
                            {lang.text}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>

            {/* GitHub Calendar */}
            <div className='px-2 md:px-6 bg-card rounded-lg p-4 shadow-sm'>
              <h2 className='text-xl font-sora font-semibold mb-4'>Contribution Graph</h2>
              <div className='w-full overflow-x-auto'>
                <GitHubCalendar 
                  username={userDetailss.login?.toString() ?? ''} 
                  year={2025}
                  blockSize={12}
                  blockMargin={4}
                  fontSize={12}
                />
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="w-full lg:w-[35%] flex flex-col gap-4">
            {/* Add wallet is where user can add their wallet address and change there wallet address */}

            <AddWallet />

            {/* User Bounty Dets is where user can see their bounty which they have earned and how many issue they have solved */}
            <div className="md:flex hidden">
            <UserBountyDets />
            </div>
            <Separator />
            {/* User Issues Solved is where user can see their issues which they have solved */}
            <UserIssuesSolved />
          </div>
        </div>
    </div>
    </div>
  )
}

export default Page