'use client'
import axios from 'axios';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface UserDetails {
    name?: string;
    email?: string;
}

interface UserDetailsContextType {
    userDetails: UserDetails;
    setUserDetails: React.Dispatch<React.SetStateAction<UserDetails>>;
}

const UserDetailsContext = createContext<UserDetailsContextType | undefined>(undefined);

export function UserDetailsProvider({ children }: { children: ReactNode }) {
    const [userDetails, setUserDetails] = useState<UserDetails>({});

    async function getUserDets(){
        const res = await axios.get("/api/user/details");
        setUserDetails(res.data.message);
        // console.log("user details", res.data.message);
    }

    useEffect(() => {
        try{
            getUserDets();
        } catch (e){
            console.log("error fetching user details", e);
        }
    }, []);

    return (
        <UserDetailsContext.Provider value={{ userDetails, setUserDetails }}>
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