"use client"
import { useUserDetails } from '@/app/context/UserDetailsProvider'
import Image from 'next/image';
import React, { useState } from 'react';
import GitHubCalendar from 'react-github-calendar'
import languageColors from 'github-language-colors';
import { Separator } from "@/components/ui/separator"
import UserBountyDets from '@/app/(dashboardComponents)/UserBountyDets';
import UserIssuesSolved from '@/app/(dashboardComponents)/UserIssuesSolved';
import AddWallet from '@/app/(dashboardComponents)/AddWallet';
import { usePrivy } from '@privy-io/react-auth';
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, MapPin, Users, BookOpen, GitFork, Star, Calendar, Clock, Code, Settings, Eye, Plus } from "lucide-react"

const Page = () => {
  const { userDetailss, wakaTimeDetails, wakaTimeApiKey, setWakaTimeApiKey, isLoading, error, githubStats } = useUserDetails();
  const { user } = usePrivy();
  const [tempWakaTimeKey, setTempWakaTimeKey] = useState(wakaTimeApiKey || '');
  const [isSavingKey, setIsSavingKey] = useState(false);
  const [showWakaTimeInput, setShowWakaTimeInput] = useState(!wakaTimeApiKey);
  const walletAddress = user?.wallet?.address;

  const handleSaveWakaTimeKey = async () => {
    setIsSavingKey(true);
    try {
      setWakaTimeApiKey(tempWakaTimeKey);
      setShowWakaTimeInput(false);
    } catch (error) {
      console.error('Error saving WakaTime API key:', error);
    } finally {
      setIsSavingKey(false);
    }
  };

  const handleRemoveWakaTimeKey = () => {
    setWakaTimeApiKey('');
    setTempWakaTimeKey('');
    setShowWakaTimeInput(true);
  };

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto" />
          <p className="text-gray-600 dark:text-gray-400">Loading your GitHub profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center mx-auto">
                <span className="text-red-600 text-xl">!</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">Something went wrong</h3>
                <p className="text-sm text-red-600 dark:text-red-400 mt-1">{error}</p>
              </div>
              <Button onClick={() => window.location.reload()} variant="outline" size="sm">
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full h-full md:px-2 !overflow-hidden">
      <div className='w-full h-full !overflow-hidden py-6'>
        {/* Profile Header */}
        <div className='flex md:flex-row flex-col md:items-start gap-4 md:gap-6 md:mb-8'>
          <div className='flex items-start gap-4'>
            <div className='w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-gray-200 dark:border-gray-700 overflow-hidden relative shadow-lg'>
              <Image 
                src={userDetailss.avatar_url ?? '/default-avatar.png'} 
                alt="User Avatar" 
                fill 
                className="object-cover"
              />
            </div>
            
            {/* User Info */}
            <div className='flex flex-col items-start gap-2 mt-2'>
              <h1 className='text-2xl md:text-3xl font-bold'>{userDetailss.name || userDetailss.login}</h1>
              <p className='text-gray-600 dark:text-gray-400 text-lg'>@{userDetailss.login}</p>
              {userDetailss.bio && (
                <p className='text-gray-700 dark:text-gray-300 max-w-md leading-relaxed'>{userDetailss.bio}</p>
              )}
              <div className='flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mt-2'>
                {userDetailss.location && (
                  <div className='flex items-center gap-1'>
                    <MapPin className='w-4 h-4' />
                    <span>{userDetailss.location}</span>
                  </div>
                )}
                <div className='flex items-center gap-1'>
                  <Calendar className='w-4 h-4' />
                  <span>Joined {new Date(userDetailss.created_at || '').toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex md:hidden">
            <UserBountyDets />
          </div>
        </div>

        {/* GitHub Stats Cards */}
        <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mb-6'>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <BookOpen className='w-5 h-5 text-blue-600' />
                <div>
                  <p className='text-2xl font-bold'>{userDetailss.public_repos || 0}</p>
                  <p className='text-sm text-gray-600 dark:text-gray-400'>Repositories</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Users className='w-5 h-5 text-green-600' />
                <div>
                  <p className='text-2xl font-bold'>{userDetailss.followers || 0}</p>
                  <p className='text-sm text-gray-600 dark:text-gray-400'>Followers</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Eye className='w-5 h-5 text-purple-600' />
                <div>
                  <p className='text-2xl font-bold'>{userDetailss.following || 0}</p>
                  <p className='text-sm text-gray-600 dark:text-gray-400'>Following</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Star className='w-5 h-5 text-yellow-600' />
                <div>
                  <p className='text-2xl font-bold'>{githubStats?.total_stars || 0}</p>
                  <p className='text-sm text-gray-600 dark:text-gray-400'>Total Stars</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className='flex flex-col lg:flex-row justify-between gap-6'>
          {/* Left Column */}
          <div className='flex flex-col gap-6 py-4 w-full lg:w-[60%]'>
            
            {/* GitHub Languages */}
            {githubStats?.languages && githubStats.languages.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <Code className='w-5 h-5' />
                    Most Used Languages
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {githubStats.languages.slice(0, 5).map((lang, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span
                            className="h-3 w-3 rounded-full"
                            style={{ backgroundColor: languageColors[lang.name as keyof typeof languageColors] || '#ccc' }}
                          />
                          <span className="text-sm font-medium">{lang.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div 
                              className="h-full rounded-full"
                              style={{ 
                                width: `${lang.percentage}%`,
                                backgroundColor: languageColors[lang.name as keyof typeof languageColors] || '#ccc'
                              }}
                            />
                          </div>
                          <span className="text-sm text-gray-600 dark:text-gray-400 w-12 text-right">{lang.percentage.toFixed(1)}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* WakaTime Stats */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className='flex items-center gap-2'>
                    <Clock className='w-5 h-5' />
                    Coding Activity (WakaTime)
                  </CardTitle>
                  {wakaTimeApiKey && !showWakaTimeInput && (
                    <Button variant="ghost" size="sm" onClick={() => setShowWakaTimeInput(true)}>
                      <Settings className='w-4 h-4' />
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {showWakaTimeInput || !wakaTimeApiKey ? (
                  <div className="space-y-4">
                    <div className="text-center py-6">
                      <Clock className='w-12 h-12 text-gray-400 mx-auto mb-3' />
                      <p className="text-gray-600 dark:text-gray-400 mb-4">
                        Connect your WakaTime account to see detailed coding statistics
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Input
                        type="password"
                        placeholder="Enter your WakaTime API key"
                        value={tempWakaTimeKey}
                        onChange={(e) => setTempWakaTimeKey(e.target.value)}
                        className="flex-1"
                      />
                      <Button 
                        onClick={handleSaveWakaTimeKey}
                        disabled={isSavingKey || !tempWakaTimeKey.trim()}
                      >
                        {isSavingKey ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Get your API key from <a href="https://wakatime.com/settings/account" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">WakaTime Settings</a>
                    </p>
                  </div>
                ) : wakaTimeDetails ? (
                  <div className='space-y-6'>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <p className='text-2xl font-bold text-blue-600'>{wakaTimeDetails.total_coding_hours}</p>
                        <p className='text-sm text-gray-600 dark:text-gray-400'>Last 7 Days</p>
                      </div>
                      <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <p className='text-2xl font-bold text-green-600'>{wakaTimeDetails.top_languages?.length || 0}</p>
                        <p className='text-sm text-gray-600 dark:text-gray-400'>Languages Used</p>
                      </div>
                    </div>

                    {wakaTimeDetails.top_languages && wakaTimeDetails.top_languages.length > 0 && (
                      <div>
                        <h4 className='font-semibold mb-3'>Top Languages This Week</h4>
                        <div className="space-y-2">
                          {wakaTimeDetails.top_languages.slice(0, 5).map((lang, index) => (
                            <div key={index} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                              <div className="flex items-center gap-2">
                                <span
                                  className="h-3 w-3 rounded-full"
                                  style={{ backgroundColor: languageColors[lang.name as keyof typeof languageColors] || '#ccc' }}
                                />
                                <span className="text-sm font-medium">{lang.name}</span>
                              </div>
                              <Badge variant="secondary" className="text-xs">{lang.hours}</Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {showWakaTimeInput && (
                      <div className="pt-4 border-t">
                        <div className="flex gap-2">
                          <Input
                            type="password"
                            placeholder="Update WakaTime API key"
                            value={tempWakaTimeKey}
                            onChange={(e) => setTempWakaTimeKey(e.target.value)}
                            className="flex-1"
                          />
                          <Button 
                            onClick={handleSaveWakaTimeKey}
                            disabled={isSavingKey}
                            size="sm"
                          >
                            {isSavingKey ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Update'}
                          </Button>
                          <Button 
                            onClick={handleRemoveWakaTimeKey}
                            variant="destructive"
                            size="sm"
                          >
                            Remove
                          </Button>
                          <Button 
                            onClick={() => setShowWakaTimeInput(false)}
                            variant="ghost"
                            size="sm"
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                    <p className="text-gray-600 dark:text-gray-400">Loading WakaTime stats...</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* GitHub Calendar */}
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <GitFork className='w-5 h-5' />
                  Contribution Graph
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='w-full overflow-x-auto'>
                  <GitHubCalendar 
                    username={userDetailss.login?.toString() ?? ''} 
                    year={2025}
                    blockSize={12}
                    blockMargin={4}
                    fontSize={12}
                    theme={{
                      dark: ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353'],
                      light: ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39']
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="w-full lg:w-[35%] flex flex-col gap-4">
            <AddWallet walletAddress={walletAddress ?? ""} />
            <div className="md:flex hidden">
              <UserBountyDets />
            </div>
            <Separator />
            <UserIssuesSolved />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Page