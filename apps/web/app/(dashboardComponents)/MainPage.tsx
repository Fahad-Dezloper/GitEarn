"use client"
import React from 'react'
import SuggestedBounties from './SuggestedBounties';
import TotalEarning from './TotalEarning';
import HowitWorks from './HowitWorks';
import BountyEarners from './BountyEarners';
import HighLightBar from './HighLightBar';
import LandingAddBounty from './LandingAddBounty';

const MainPage = () => {
    return (
        <div className='w-full h-full flex md:flex-row flex-col gap-8 py-6'>
            {/* left sidebar */}
            <div className="md:w-[140vw] h-fit overflow-hidden w-full flex flex-col gap-8">
                <HighLightBar />
                <SuggestedBounties />
                <LandingAddBounty />
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
