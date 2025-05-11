"use client"
import HuntersLeaderboard from '@/app/(dashboardComponents)/BountyTable'
import Topbar from '@/app/(dashboardComponents)/Topbar'
import React from 'react'

const page = () => {
  return (
    <div className=''>
      <Topbar />
      <div className="flex flex-col gap-4 sm:gap-4 py-3 sm:py-4">
      <div className="flex flex-col gap-1 sm:gap-2">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-sora font-semibold">Leaderboard</h1>
      </div>

      <div>
        <HuntersLeaderboard />
      </div>
      </div>
    </div>
  )
}

export default page