
import React from 'react'
import StaronGithub from './staronGithub'
import TweetUs from './TweetUs'

const HighLightBar = () => {
  return (
    <div className='w-full h-full flex flex-col gap-2 relative overflow-hidden'>
      <div className='bggrad bg-gradient-to-r from-[#2A2F3E] px-4 to-[#1A1F2E] py-4 rounded-2xl'>
      <div className='relative flex items-center gap-3 mb-1 '>
        <h1 className="text-white text-xl font-black font-sora">Welcome back, Fahad</h1>
      </div>
      <p className="relative text-sm text-gray-300/90">
        We&apos;re so glad to have you on GitEarn 
        <span className="animate-bounce ml-1">💰</span>
      </p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
      <div className="dark:bg-[#11131B] bg-[#F5F9FE] p-4 rounded-lg border">
          <h3 className="dark:text-white text-black font-semibold mb-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full font-sora bg-blue-400 animate-pulse"></span>
            Latest Updates
          </h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm">We just launched our new bounty system! Earn more by completing tasks.</p>
        </div>

        <div className='md:flex hidden w-full justify-end items-center gap-4 px-3'>
          <TweetUs />
          <StaronGithub />
        </div>
      </div>

      {/* <div className="relative mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-white/[0.07] to-white/[0.03] p-4 rounded-lg border border-white/[0.05] hover:border-white/[0.1] transition-all duration-300">
          <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse"></span>
            Support Us
          </h3>
          <div className="flex flex-wrap gap-2">
            <a href="https://github.com/your-repo" target="_blank" rel="noopener noreferrer" 
               className="text-sm bg-gradient-to-r from-blue-500/20 to-purple-500/20 hover:from-blue-500/30 hover:to-purple-500/30 px-3 py-1 rounded-full text-white transition-all duration-300 border border-white/[0.05] hover:border-white/[0.1]">
               ⭐ Star on GitHub
            </a>
            <a href="https://peerlist.io/your-profile" target="_blank" rel="noopener noreferrer"
               className="text-sm bg-gradient-to-r from-purple-500/20 to-pink-500/20 hover:from-purple-500/30 hover:to-pink-500/30 px-3 py-1 rounded-full text-white transition-all duration-300 border border-white/[0.05] hover:border-white/[0.1]">
               Vote on Peerlist
            </a>
          </div>
        </div>

        <div className="bg-gradient-to-br from-white/[0.07] to-white/[0.03] p-4 rounded-lg md:col-span-2 border border-white/[0.05] hover:border-white/[0.1] transition-all duration-300">
          <p className="text-gray-300 text-sm italic">&quot;The more you contribute, the more you earn. Let&apos;s build the future of open source together!&quot;</p>
          <a href="https://twitter.com/intent/tweet?text=Just%20earned%20on%20GitEarn!%20Join%20me%20in%20building%20the%20future%20of%20open%20source%20contributions%20%E2%9C%A8&url=https://gitearn.com" 
             target="_blank" rel="noopener noreferrer"
             className="mt-2 inline-block text-sm bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 px-3 py-1 rounded-full text-white transition-all duration-300 shadow-lg shadow-blue-500/20">
             Share on Twitter 🚀
          </a>
        </div>
      </div> */}
    </div>
  )
}

export default HighLightBar