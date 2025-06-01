/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import axios from 'axios';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface UserDetailss {
    followers: number;
    following: number;
    public_repos: number;
    location: string;
    bio: string;
    login: string;
    avatar_url: string | undefined;
    name?: string;
    email?: string;
    created_at?: string;
    company?: string;
    blog?: string;
    twitter_username?: string;
}

interface GitHubStats {
    total_stars: number;
    total_forks: number;
    languages: Array<{name: string; count: number; percentage: number}>;
}

interface WakaTimeDetails {
    total_coding_hours: string;
    top_languages: Array<{name: string; hours: string}>;
    wakatime_raw?: any;
}

interface UserDetailssContextType {
    userDetailss: UserDetailss;
    setUserDetailss: React.Dispatch<React.SetStateAction<UserDetailss>>;
    githubStats: GitHubStats | null;
    setGithubStats: React.Dispatch<React.SetStateAction<GitHubStats | null>>;
    wakaTimeDetails: WakaTimeDetails | null;
    setWakaTimeDetails: React.Dispatch<React.SetStateAction<WakaTimeDetails | null>>;
    userPrivyDID: string | undefined;
    wakaTimeApiKey: string | null;
    setWakaTimeApiKey: (key: string) => void;
    isLoading: boolean;
    error: string | null;
    refreshData: () => void;
}

const UserDetailsContext = createContext<UserDetailssContextType | undefined>(undefined);

export function UserDetailsProvider({ children }: { children: ReactNode }) {
    const [userDetailss, setUserDetailss] = useState<UserDetailss>({
        followers: 0,
        following: 0,
        public_repos: 0,
        location: '',
        bio: '',
        login: '',
        avatar_url: undefined
    });
    const [githubStats, setGithubStats] = useState<GitHubStats | null>(null);
    const [wakaTimeDetails, setWakaTimeDetails] = useState<WakaTimeDetails | null>(null);
    const [userPrivyDID, setUserPrivyDID] = useState<string | undefined>();
    const [wakaTimeApiKey, setWakaTimeApiKey] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Load WakaTime API key from localStorage on mount
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const savedKey = localStorage.getItem('wakatime_api_key');
            if (savedKey) {
                setWakaTimeApiKey(savedKey);
            }
        }
    }, []);

    // Save WakaTime API key to localStorage when it changes
    const handleSetWakaTimeApiKey = (key: string) => {
        if (typeof window !== 'undefined') {
            if (key) {
                localStorage.setItem('wakatime_api_key', key);
            } else {
                localStorage.removeItem('wakatime_api_key');
            }
        }
        setWakaTimeApiKey(key);
    };

    async function getUserDets() {
        setIsLoading(true);
        setError(null);
        try {
            const headers: Record<string, string> = {};
            if (wakaTimeApiKey) {
                headers['x-wakatime-api-key'] = wakaTimeApiKey;
            }

            const res = await axios.get("/api/user/details", { headers });
            
            if (res.data.github) {
                setUserDetailss(res.data.github);
            }
            if (res.data.githubStats) {
                setGithubStats(res.data.githubStats);
            }
            if (res.data.wakatime) {
                setWakaTimeDetails(res.data.wakatime);
            } else if (!wakaTimeApiKey) {
                // Clear WakaTime details if no API key is provided
                setWakaTimeDetails(null);
            }
            if (res.data.userPrivyId) {
                setUserPrivyDID(res.data.userPrivyId);
            }
        } catch (e: any) {
            console.error("Error fetching user details:", e);
            const errorMessage = e.response?.data?.error || "Failed to fetch user details";
            setError(errorMessage);
            
            // If it's an auth error, clear sensitive data
            if (e.response?.status === 401) {
                setUserDetailss({
                    followers: 0,
                    following: 0,
                    public_repos: 0,
                    location: '',
                    bio: '',
                    login: '',
                    avatar_url: undefined
                });
                setGithubStats(null);
                setWakaTimeDetails(null);
            }
        } finally {
            setIsLoading(false);
        }
    }

    // Fetch user details when component mounts or WakaTime API key changes
    useEffect(() => {
        getUserDets();
    }, [wakaTimeApiKey]);

    // Function to manually refresh data
    const refreshData = () => {
        getUserDets();
    };

    return (
        <UserDetailsContext.Provider 
            value={{ 
                userDetailss, 
                setUserDetailss, 
                githubStats,
                setGithubStats,
                wakaTimeDetails, 
                setWakaTimeDetails, 
                userPrivyDID,
                wakaTimeApiKey,
                setWakaTimeApiKey: handleSetWakaTimeApiKey,
                isLoading,
                error,
                refreshData
            }}
        >
            {children}
        </UserDetailsContext.Provider>
    );
}

export function useUserDetails() {
    const context = useContext(UserDetailsContext);
    if (context === undefined) {
        throw new Error('useUserDetails must be used within a UserDetailsProvider');
    }
    return context;
}