"use client"
import React from 'react'
import SuggestedBounties from './SuggestedBounties';
import TotalEarning from './TotalEarning';
import HowitWorks from './HowitWorks';
import BountyEarners from './BountyEarners';
import AddBounty from './AddBounty';
import { useSession } from 'next-auth/react';

const MainPage = () => {
    const {data: session, status} = useSession();
    console.log("session here with status", session, status);

    const token = session?.accessToken
    
    if(!token){
        return <div>Loading...</div>
    }

    return (
        <div className='w-full h-full flex md:flex-row flex-col gap-8 py-6'>
            {/* left sidebar */}
            <div className="md:w-[140vw] w-full flex flex-col gap-8">
                <div className='w-full bggrad px-5 py-4 rounded-xl relative overflow-hidden bg-gradient-to-r from-[#2A2F3E] to-[#1A1F2E]'>
                    <div className="absolute -top-[40%] -left-[10%] w-[60%] h-[100%] bg-blue-500/20 blur-[100px] rounded-full" />
                    <div className="absolute -bottom-[40%] -right-[10%] w-[60%] h-[100%] bg-purple-500/20 blur-[100px] rounded-full" />
                    
                    <div className='relative flex items-center gap-3 mb-1'>
                        <div className="w-1 h-6 rounded-full bg-gradient-to-b from-blue-400 to-purple-500" />
                        <h1 className="text-white text-xl font-black font-sora">Welcome back, Fahad</h1>
                    </div>
                    <p className="relative text-sm text-gray-300/90 pl-4">
                        We&apos;re so glad to have you on GitEarn 
                        <span className="animate-bounce ml-1">💰</span>
                    </p>
                </div>

                <SuggestedBounties />
                <AddBounty token={token} />
            </div>

            <div className="max-w-[25vw] hidden md:flex flex-col gap-3">
                <TotalEarning />
                <HowitWorks />
                <BountyEarners />
            </div>
        </div>
    )
}

export default MainPage
