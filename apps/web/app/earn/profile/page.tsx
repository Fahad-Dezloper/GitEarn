/* eslint-disable @typescript-eslint/no-explicit-any */
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


const Page = () => {
  const { userDetailss, wakaTimeDetails } = useUserDetails();
  
  return (
    <div className='w-full max-h-screen overflow-hidden py-6'>
        <div className='flex items-center gap-2'>
          <div className='w-32 h-32 rounded-full border-2 border-white overflow-hidden relative'>
            <Image 
              src={userDetailss.avatar_url ?? '/default-avatar.png'} 
              alt="User Avatar" 
              fill 
              className="object-cover"
              />
          </div>
          
          {/* User Info */}
          <div className='flex flex-col gap-2 '>
            <h1 className='text-2xl font-bold '>{userDetailss.name || userDetailss.login}</h1>
            <p className=''>@{userDetailss.login}</p>
          </div>
        </div>

      {/* User Details Section */}
      <div className=' flex justify-between gap-6'>
        <div className='flex flex-col gap-6 py-4'>
        <div className='px-6'>
          <h2 className='text-xl font-semibold font-sora mb-4'>Profile Information</h2>
          <div className='space-y-3'>
            {userDetailss.bio && (
              <div>
                <p className='text-gray-600 font-sora'>Bio</p>
                <p>{userDetailss.bio}</p>
              </div>
            )}
            <div className='flex justify-between items-center'>
            <div>
              <p className='text-gray-600 font-sora'>Location</p>
              <p>{userDetailss.location || 'Not specified'}</p>
            </div>
            <div>
              <p className='text-gray-600 font-sora'>Repositories</p>
              <p>{userDetailss.public_repos || 0} </p>
            </div>
            <div>
              <p className='text-gray-600 font-sora'>Followers</p>
              <p>{userDetailss.followers || 0} followers</p>
            </div>
            </div>
          </div>
        </div>
        <div className='px-6'>
          <h2 className='text-xl font-sora font-semibold mb-4'>GitHub Stats</h2>
          {wakaTimeDetails?.wakatime_raw && (
            <div className='space-y-3'>
              <div>
                <p className='text-gray-600 font-sora'>Total Coding Time (Last 7 Days)</p>
                <p className='text-lg font-medium'>
                  {wakaTimeDetails.wakatime_raw.human_readable_total || 'N/A'}
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <p className='text-gray-600 font-sora'>Top Languages</p>
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
        <div className='max-w-[38vw] h-fit flex items-center justify-center'>
                <GitHubCalendar username={userDetailss.login?.toString() ?? ''} year={2025} />
              </div>
        </div>

        <div className="max-w-[30vw] flex flex-col gap-3 h-full">
          <AddWallet />
          <UserBountyDets />
          <Separator />
          <UserIssuesSolved />
          </div>
      </div>
    </div>
  )
}

export default Page