'use client'
import axios from 'axios';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface UserDetailss {
    avatar_url: string | undefined;
    name?: string;
    email?: string;
}

interface UserDetailssContextType {
    userDetailss: UserDetailss;
    setUserDetailss: React.Dispatch<React.SetStateAction<UserDetailss>>;
}

const UserDetailsContext = createContext<UserDetailssContextType | undefined>(undefined);

export function UserDetailsProvider({ children }: { children: ReactNode }) {
    const [userDetailss, setUserDetailss] = useState<UserDetailss>({});
    const [wakaTimeDetails, setWakaTimeDetails] = useState({});
    const [walletAdd, setWalletAdd] = useState();

    async function getUserDets(){
        const res = await axios.get("/api/user/details");
        setUserDetailss(res.data.github);
        setWakaTimeDetails(res.data.wakatime)
        // console.log("user details response from context", res.data);
    }

    async function addWalletAdd({dbWallet}){
        // console.log("reached here with", dbWallet);
        const res = await axios.post("/api/user/wallet/add", {
            walletAddress: dbWallet
          });
    }

    async function fetchUserwalletAdd(){
        const res = await axios.get("/api/user/wallet/get");
        console.log("res", res);
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

// --create context --function with children as provider -- useUserDetails