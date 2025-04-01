/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import axios from 'axios';
import { useWallet } from "@solana/wallet-adapter-react";
import { getProgram } from "@/utils/anchorClient";

export default function Dashboard() {
  const { publicKey, wallet } = useWallet();
  const [data, setData] = useState(null);
  const { data: session } = useSession()
  const [repos, setRepos] = useState([])
  console.log("from session", session);

  const fetchData = async () => {
    if (!publicKey) {
      alert("Connect wallet first!");
      return;
    }

    try {
      const program = getProgram(wallet);
      // Fetch all bounties where the user is the creator
      const bounties = await program.account.bounty.all([
        {
          memcmp: {
            offset: 8, // After discriminator
            bytes: publicKey.toBase58(),
          },
        },
      ]);
      setData(bounties);
    } catch (error) {
      console.error("Error fetching bounties:", error);
      alert("Error fetching bounties. Check console for details.");
    }
  };

  useEffect(() => {
    if (!session?.accessToken) return

    const fetchRepos = async () => {
      const res = await axios.get("https://api.github.com/user/repos?visibility=public", {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
      })
      const data = await res
      setRepos(data.data)
    }

    fetchRepos()
  }, [session])

  if (!session) return <p>Loading...</p>

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Welcome, {session?.user?.name}</h1>
      <h2 className="text-xl mt-4">Your Public Repositories:</h2>
      <div>
      <button className="cursor-pointer hover:text-blue-500" onClick={fetchData} disabled={!publicKey}>
        Fetch Data
      </button>
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
    </div>
      {/* <div className="flex flex-wrap gap-6">
        {repos.map((repo) => (
          <Link href={`/dashboard/repo/${repo.name}`} className="w-[18vw] dark:border-gray-300 border shadow-xl rounded-md h-[20vh] shadow-sm flex items-center justify-center" key={repo.id}>
            <span className="text-blue-500">
              {repo.name}
            </span>
          </Link>
        ))}
      </div> */}
    </div>
  )
}
