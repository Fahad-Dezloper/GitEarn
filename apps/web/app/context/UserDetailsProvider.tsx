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
    addWalletAdd: (params: { dbWallet: string }) => Promise<void>;
    walletAdd: any;
}

const UserDetailsContext = createContext<UserDetailssContextType | undefined>(undefined);

export function UserDetailsProvider({ children }: { children: ReactNode }) {
    const [userDetailss, setUserDetailss] = useState<UserDetailss>({ avatar_url: undefined });
    const [wakaTimeDetails, setWakaTimeDetails] = useState({});
    const [walletAdd, setWalletAdd] = useState();

    async function getUserDets(){
        const res = await axios.get("/api/user/details");
        setUserDetailss(res.data.github);
        setWakaTimeDetails(res.data.wakatime)
    }

    async function addWalletAdd({dbWallet}: {dbWallet: string}){
        const res = await axios.post("/api/user/wallet/add", {
            walletAddress: dbWallet
          });
    }

    async function fetchUserwalletAdd(){
        const res = await axios.get("/api/user/wallet/get");
        // console.log("res", res);
        setWalletAdd(res.data.walletAdd);
    }

    useEffect(() => {
        try{
            getUserDets();
            fetchUserwalletAdd();
        } catch (e){
            console.log("error fetching user details", e);
        }
    }, []);

    return (
        <UserDetailsContext.Provider value={{ userDetailss, setUserDetailss, wakaTimeDetails, setWakaTimeDetails, addWalletAdd, walletAdd }}>
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
