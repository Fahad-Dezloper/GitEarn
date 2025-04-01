import React from 'react'
import SuggestedBounties from './SuggestedBounties';
import TotalEarning from './TotalEarning';

const MainPage = () => {
   
    return (
        <div className='w-full h-full flex gap-3'>
            {/* left sidebar */}
            <div className="w-[140vw] flex flex-col gap-4 h-screen p-4">
                {/* Welcome Section */}
                <div className='flex flex-col gap-2 w-full bggrad p-6 rounded-xl'>
                    <div className="text-white text-3xl font-black">Welcome back, Fahad</div>
                    <div className="flex text-gray-300 leading-none flex-col gap-1">
                        <p>We&apos;re so glad to have you on GitEarn</p>
                        <p>let&apos;s make some $bucks shall we</p>
                    </div>
                </div>

                {/* Suggested for You Section */}
                <SuggestedBounties />
            </div>

            {/* right sidebar */}
            <div className="w-full h-screen p-6">
                {/* Total Earnings Section */}
                <TotalEarning />
            </div>
        </div>
    )
}

export default MainPage