"use client"
import { useUserDetails } from '@/app/context/UserDetailsProvider'
import Image from 'next/image';
import React from 'react'

const Page = () => {
  const { userDetails } = useUserDetails();
  
  return (
    <div className='w-full min-h-screen bg-gray-50 py-6 px-4'>
      {/* Cover and Profile Section */}
      <div className='w-full relative h-[200px] rounded-2xl border bg-gray-200'>
        <div className='absolute -bottom-16 left-8 flex items-end gap-6'>
          {/* Profile Image */}
          <div className='w-32 h-32 rounded-full border-4 border-white overflow-hidden relative'>
            <Image 
              src={userDetails.avatar_url} 
              alt="User Avatar" 
              fill 
              className="object-cover"
            />
          </div>
          
          {/* User Info */}
          <div className='mb-4'>
            <h1 className='text-2xl font-bold'>{userDetails.name || userDetails.login}</h1>
            <p className='text-gray-600'>@{userDetails.login}</p>
          </div>
        </div>
      </div>

      {/* User Details Section */}
      <div className='mt-24 grid grid-cols-1 md:grid-cols-2 gap-6 px-8'>
        <div className='bg-white p-6 rounded-lg shadow'>
          <h2 className='text-xl font-semibold mb-4'>Profile Information</h2>
          <div className='space-y-3'>
            {userDetails.bio && (
              <div>
                <p className='text-gray-600'>Bio</p>
                <p>{userDetails.bio}</p>
              </div>
            )}
            <div>
              <p className='text-gray-600'>Location</p>
              <p>{userDetails.location || 'Not specified'}</p>
            </div>
            <div>
              <p className='text-gray-600'>Repositories</p>
              <p>{userDetails.public_repos || 0} public repositories</p>
            </div>
            <div>
              <p className='text-gray-600'>Followers</p>
              <p>{userDetails.followers || 0} followers</p>
            </div>
          </div>
        </div>

        <div className='bg-white p-6 rounded-lg shadow'>
          <h2 className='text-xl font-semibold mb-4'>GitHub Stats</h2>
          <div className='space-y-3'>
            <div>
              <p className='text-gray-600'>Following</p>
              <p>{userDetails.following || 0} users</p>
            </div>
            <div>
              <p className='text-gray-600'>Created At</p>
              <p>{new Date(userDetails.created_at).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Page