import React from 'react'
import { BiSolidDollarCircle } from "react-icons/bi";
import { VscIssues } from "react-icons/vsc";

const TotalEarning = () => {
  return (
    <div className='w-full h-fit flex items-center justify-center'>
            <div className='w-fit  h-full flex flex-col gap-4 p-6 rounded-xl 
                bg-gradient-to-br from-blue-50/50 to-blue-100/30 dark:from-[#1A1F2E]/50 dark:to-[#2A2F3E]/50
                border border-blue-100/50 dark:border-blue-900/20
                transition-all duration-300'>
                <div className='flex gap-6 '>
                    <div className='flex gap-3 items-start justify-center'>
                        <div className='p-2 rounded-lg bg-[#007AFF]/10 dark:bg-[#00D1FF]/10'>
                            <BiSolidDollarCircle size={24} className="text-[#007AFF] dark:text-[#00D1FF]" />
                        </div>
                        <div>
                            <div className="leading-none flex flex-col gap-1 mt-1">
                                <p className="font-semibold text-gray-800 dark:text-gray-100 font-sora">$4,025,180</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Total Bounties Distributed</p>
                            </div>
                        </div>
                    </div>
                    <div className='w-[3px] bg-gray-600 rounded-full dark:bg-gray-400' />
                    <div className="flex gap-3 items-start justify-center">
                        <div className='p-2 rounded-lg bg-[#007AFF]/10 dark:bg-[#00D1FF]/10'>
                            <VscIssues size={24} className="text-[#007AFF] dark:text-[#00D1FF]" />
                        </div>
                        <div>
                            <p className="font-semibold text-gray-800 dark:text-gray-100 font-sora">100</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Currently Active Issues</p>
                        </div>
                    </div>
                </div>
            </div>
    </div>
  )
}

export default TotalEarning;