"use client"
import HuntersLeaderboard from '@/app/(dashboardComponents)/BountyTable'
import React from 'react'

const page = () => {
  return (
    <div className='w-full h-full relative'>
      <div className='w-full flex items-center justify-center'>
      <h1 className='text-[12rem] font-sora tracking-tighter absolute inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden'>Hunters</h1>
      </div>

      <div>
        <HuntersLeaderboard />
      </div>
    </div>
  )
}

export default page