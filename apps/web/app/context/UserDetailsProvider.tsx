/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import axios from 'axios';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface UserDetailss {
    followers: number;
    public_repos: number;
    location: string;
    bio: React.JSX.Element;
    login: ReactNode;
    avatar_url: string | undefined;
    name?: string;
    email?: string;
}


interface UserDetailssContextType {
    userDetailss: UserDetailss;
    setUserDetailss: React.Dispatch<React.SetStateAction<UserDetailss>>;
    wakaTimeDetails: any;
    setWakaTimeDetails: React.Dispatch<React.SetStateAction<any>>;
}

const UserDetailsContext = createContext<UserDetailssContextType | undefined>(undefined);
export function UserDetailsProvider({ children }: { children: ReactNode }) {
    const [userDetailss, setUserDetailss] = useState<UserDetailss>({
        followers: 0,
        public_repos: 0,
        location: '',
        bio: <></>,
        login: '',
        avatar_url: undefined
    });
    const [wakaTimeDetails, setWakaTimeDetails] = useState({});
    // const [walletAdd, setWalletAdd] = useState<string | undefined>();

    async function getUserDets(){
        const res = await axios.get("/api/user/details");
        setUserDetailss(res.data.github);
        setWakaTimeDetails(res.data.wakatime)
    }

    // async function fetchUserwalletAdd(){
    //     const res = await axios.get("/api/user/wallet/get");
    //     // console.log("res for wallet ADD", res.data);
    //     setWalletAdd(res.data.walletAdd);
    // }


    useEffect(() => {
        try{
            getUserDets();
        } catch (e){
            console.log("error fetching user details", e);
        }
    }, []);
    return (
        <UserDetailsContext.Provider value={{ userDetailss, setUserDetailss, wakaTimeDetails, setWakaTimeDetails }}>
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
