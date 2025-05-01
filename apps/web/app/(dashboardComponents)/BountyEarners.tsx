"use client"
import React, { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';

const dummyEarners = [
    {
        id: 1,
        name: "Fahad Mansuri",
        project: "AI3 Hackathon #01: Content Challenge",
        amount: 250,
        image: "https://avatars.githubusercontent.com/u/1234567?v=4"
    },
    {
        id: 2,
        name: "Raunak Raj Rauniyar",
        project: "Solana Summit Bengaluru Demo Day",
        amount: 3000,
        image: "https://avatars.githubusercontent.com/u/2345678?v=4"
    },
    {
        id: 3,
        name: "Raj Pratap Vidyarthi",
        project: "Solana Summit Bengaluru Demo Day",
        amount: 2000,
        image: "https://avatars.githubusercontent.com/u/3456789?v=4"
    },
    {
        id: 4,
        name: "Nischal Gautam",
        project: "UI/UX Designer for Octasol",
        amount: 200,
        image: "https://avatars.githubusercontent.com/u/4567890?v=4"
    },
    {
        id: 5,
        name: "Tom Rowbotham",
        project: "AI3 Hackathon #01: Code Challenge",
        amount: 500,
        image: "https://avatars.githubusercontent.com/u/5678901?v=4"
    },
    {
        id: 6,
        name: "Ben Harper",
        project: "AI3 Hackathon #01: Code Challenge",
        amount: 1000,
        image: "https://avatars.githubusercontent.com/u/6789012?v=4"
    },
    {
        id: 7,
        name: "Nischal Gautam",
        project: "UI/UX Designer for Octasol",
        amount: 200,
        image: "https://avatars.githubusercontent.com/u/4567890?v=4"
    },
    {
        id: 8,
        name: "Tom Rowbotham",
        project: "AI3 Hackathon #01: Code Challenge",
        amount: 500,
        image: "https://avatars.githubusercontent.com/u/5678901?v=4"
    },
    {
        id: 9,
        name: "Ben Harper",
        project: "AI3 Hackathon #01: Code Challenge",
        amount: 1000,
        image: "https://avatars.githubusercontent.com/u/6789012?v=4"
    },
    {
        id: 10,
        name: "Fahad Mansuri",
        project: "AI3 Hackathon #01: Content Challenge",
        amount: 250,
        image: "https://avatars.githubusercontent.com/u/1234567?v=4"
    },
    {
        id: 11,
        name: "Raunak Raj Rauniyar",
        project: "Solana Summit Bengaluru Demo Day",
        amount: 3000,
        image: "https://avatars.githubusercontent.com/u/2345678?v=4"
    },
    {
        id: 12,
        name: "Raj Pratap Vidyarthi",
        project: "Solana Summit Bengaluru Demo Day",
        amount: 2000,
        image: "https://avatars.githubusercontent.com/u/3456789?v=4"
    },
];

const SCROLL_SPEED = 1.5;
const FRAME_RATE = 25;

const BountyEarners = () => {
    const [items, setItems] = useState([...dummyEarners, ...dummyEarners, ...dummyEarners]); // Triple the items for smoother transition
    const [scrollPosition, setScrollPosition] = useState(0);

    useEffect(() => {
        const scrollInterval = setInterval(() => {
            setScrollPosition(prev => {
                const itemHeight = 76; 
                const totalHeight = dummyEarners.length * itemHeight;
                
                if (prev >= totalHeight) {
                    return 0;
                }
                return prev + SCROLL_SPEED;
            });
        }, FRAME_RATE);

        return () => clearInterval(scrollInterval);
    }, []);

    useEffect(() => {
        if (scrollPosition === 0) {
            setItems(prev => {
                const firstSet = prev.slice(0, dummyEarners.length);
                return [...firstSet, ...firstSet, ...firstSet];
            });
        }
    }, [scrollPosition]);

    return (
        <div className="w-full h-fit p-6 rounded-xl bg-gradient-to-br from-blue-50/50 to-blue-100/30 dark:from-[#1A1F2E]/50 dark:to-[#2A2F3E]/50 border border-blue-100/50 dark:border-blue-900/20">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 font-sora">
                    RECENT EARNERS
                </h2>
                <button className="flex items-center gap-2 text-sm text-[#007AFF] dark:text-[#00D1FF] hover:opacity-80 transition-opacity">
                    Leaderboard
                    <ArrowRight className="w-4 h-4" />
                </button>
            </div>

            <div className="relative h-[380px] overflow-hidden">
                <div 
                    className="absolute w-full transition-transform duration-100 ease-linear"
                    style={{ transform: `translateY(-${scrollPosition}px)` }}
                >
                    {items.map((earner, index) => (
                        <div 
                            key={`${earner.id}-${index}`}
                            className="flex items-center justify-between mb-4 p-2 rounded-lg hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-blue-400 to-purple-500">
                                    <Image
                                        src={earner.image}
                                        alt={earner.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <h3 className="text-sm font-medium text-gray-800 dark:text-gray-100">
                                        {earner.name}
                                    </h3>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        {earner.project}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-1">
                                {/* <div className="w-5 h-5">
                                    <Image
                                        src="/usdc.svg"
                                        alt="USDC"
                                        width={20}
                                        height={20}
                                    />
                                </div> */}
                                <span className="text-sm font-medium text-gray-800 dark:text-gray-100">
                                    {earner.amount} <span className="text-gray-500 dark:text-gray-400">USDC</span>
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default BountyEarners;