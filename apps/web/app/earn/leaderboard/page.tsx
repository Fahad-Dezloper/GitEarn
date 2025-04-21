"use client"
import HuntersLeaderboard from '@/app/(dashboardComponents)/BountyTable'
import { ExampleSheetWithStacking } from '@/app/components/SheetWithStacking/ExampleSheetWithStacking'
import { ExampleSheetWithStackingData } from '@/app/components/SheetWithStacking/ExampleSheetWithStackingData'
import React from 'react'

const page = () => {
  return (
    <div className='w-full h-full'>
      <div className='w-full flex items-center justify-center'>
      {/* <h1 className='text-[12rem] font-sora tracking-tighter absolute inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden'>Hunters</h1> */}
      </div>

      <div>
        <HuntersLeaderboard />
        {/* <ExampleSheetWithStacking data={ExampleSheetWithStackingData} /> */}
      </div>
    </div>
  )
}

export default page