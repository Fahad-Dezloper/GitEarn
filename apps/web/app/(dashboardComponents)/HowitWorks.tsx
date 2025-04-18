"use client"
import { Check, Zap, CreditCard, Github } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function HowitWorks() {
    const [activeSteps, setActiveSteps] = useState<number[]>([]);

    useEffect(() => {
        // Animate steps and lines sequentially
        const timeouts = [
            setTimeout(() => setActiveSteps(prev => [...prev, 0]), 500),
            setTimeout(() => setActiveSteps(prev => [...prev, 1]), 1500),
            setTimeout(() => setActiveSteps(prev => [...prev, 2]), 2500)
        ];

        return () => timeouts.forEach(timeout => clearTimeout(timeout));
    }, []);

    return (
        <div className="w-full h-fit p-6 rounded-xl bg-gradient-to-br from-blue-50/50 to-blue-100/30 dark:from-[#1A1F2E]/50 dark:to-[#2A2F3E]/50 border border-blue-100/50 dark:border-blue-900/20">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 font-sora mb-4">
                HOW IT WORKS
            </h2>
            
            <div className="relative flex flex-col">
                {/* Step 1 */}
                <div className="flex gap-6 items-center">
                    <div className={`relative z-10 w-10 border border-[#007AFF] h-10 rounded-full transition-colors duration-500 
                        ${activeSteps.includes(0) ? 'bg-[#007AFF]/10 dark:bg-[#00D1FF]/10' : 'bg-transparent'} 
                        flex items-center justify-center`}>
                        <Check className={`w-5 h-5 transition-colors duration-500 
                            ${activeSteps.includes(0) ? 'text-[#007AFF] dark:text-[#00D1FF]' : 'text-gray-400 dark:text-gray-600'}`} />
                    </div>
                    <div className="flex flex-col leading-none gap-1">
                        <h3 className="text-sm font-sora text-gray-800 dark:text-gray-100">
                            Create your Profile
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400">
                            by telling us about yourself
                        </p>
                    </div>
                </div>
                <div className='relative w-1 h-[4vh] my-2 ml-4 rounded-full bg-gray-200 dark:bg-gray-800 overflow-hidden'>
                    <div 
                        className={`absolute inset-0 w-full bg-[#007AFF] dark:bg-[#00D1FF] transform transition-transform duration-700 ease-out ${
                            activeSteps.includes(0) ? 'translate-y-0' : '-translate-y-full'
                        }`}
                    />
                </div>

                {/* Step 2 */}
                <div className="flex gap-6 items-center">
                    <div className={`relative z-10 w-10 h-10 border border-[#007AFF] rounded-full transition-colors duration-500 
                        ${activeSteps.includes(1) ? 'bg-[#007AFF]/10 dark:bg-[#00D1FF]/10' : 'bg-transparent'} 
                        flex items-center justify-center`}>
                        <Zap className={`w-5 h-5 transition-colors duration-500 
                            ${activeSteps.includes(1) ? 'text-[#007AFF] dark:text-[#00D1FF]' : 'text-gray-400 dark:text-gray-600'}`} />
                    </div>
                    <div className="flex flex-col whitespace-nowrap leading-none gap-1">
                        <h3 className="text-sm font-sora flex items-center gap-2 text-gray-800 dark:text-gray-100">
                            Participate in <Github size={20} /> Bounties & Projects
                        </h3>
                        <p className="text-gray-500 flex items-center gap-2 dark:text-gray-400">
                            Get assigned <span className='text-blue-500 font-black text-sm'> / </span> Submit first
                        </p>
                    </div>
                </div>
                <div className='relative w-1 h-[4vh] my-2 ml-4 rounded-full bg-gray-200 dark:bg-gray-800 overflow-hidden'>
                    <div 
                        className={`absolute inset-0 w-full bg-[#007AFF] dark:bg-[#00D1FF] transform transition-transform duration-700 ease-out ${
                            activeSteps.includes(1) ? 'translate-y-0' : '-translate-y-full'
                        }`}
                    />
                </div>
                
                {/* Step 3 */}
                <div className="flex gap-6 items-center">
                    <div className={`relative z-10 w-10 h-10 border border-[#007AFF] rounded-full transition-colors duration-500 
                        ${activeSteps.includes(2) ? 'bg-[#007AFF]/10 dark:bg-[#00D1FF]/10' : 'bg-transparent'} 
                        flex items-center justify-center`}>
                        <CreditCard className={`w-5 h-5 transition-colors duration-500 
                            ${activeSteps.includes(2) ? 'text-[#007AFF] dark:text-[#00D1FF]' : 'text-gray-400 dark:text-gray-600'}`} />
                    </div>
                    <div className="flex flex-col leading-none gap-1">
                        <h3 className="text-sm font-sora text-gray-800 dark:text-gray-100">
                            Get Paid for Your Work
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400">
                            in CRYPTO
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
