"use client"
import { Button } from "@/components/ui/button2";
import { motion } from "motion/react";
import Image from "next/image";
import { useMemo } from "react";

const users = [
    {
      username: "@georgelucas",
      avatar: "https://avatars.githubusercontent.com/u/8079861?v=4",
      badge: "elite",
      issuesSolved: 23,
      earnings: "$1,200",
    },
    {
      username: "@hkirat",
      avatar: "https://avatars.githubusercontent.com/u/8079861?v=4",
      badge: "rookie",
      issuesSolved: 8,
      earnings: "$300",
    },
    {
      username: "@samdoe",
      avatar: "https://avatars.githubusercontent.com/u/155962781?v=4",
      badge: "newbie",
      issuesSolved: 2,
      earnings: "$50",
    },
    {
      username: "@georgelucas",
      avatar: "https://avatars.githubusercontent.com/u/8079861?v=4",
      badge: "elite",
      issuesSolved: 23,
      earnings: "$1,200",
    },
    {
      username: "@hkirat",
      avatar: "https://avatars.githubusercontent.com/u/155962781?v=4",
      badge: "rookie",
      issuesSolved: 8,
      earnings: "$300",
    },
    {
      username: "@samdoe",
      avatar: "https://avatars.githubusercontent.com/u/8079861?v=4",
      badge: "newbie",
      issuesSolved: 2,
      earnings: "$50",
    },
  ];


const RightSideLanding = () => {
  return (
    <div className="relative w-full h-full flex flex-wrap gap-6">
      {users.map((user, i) => (
       <motion.div drag key={i} className="rounded-xl h-fit flex-col flex gap-2 w-[11vw] p-2 bg-black">
        <div className="h-[15vh] w-full rounded-md overflow-hidden">
            <img src={user.avatar} className="w-full h-full object-cover" alt="user avatar" />
        </div>
            <div key={i} className=" text-xs w-full text-center rounded-t-md bg-black px-2 py-1 hover:bg-black/80 text-white">
              {user.username}
            </div>

        <div className="bg-[#1B1E25] flex w-full px-3 py-2 justify-between rounded-md">
          <div className="flex flex-col gap-2 text-xs">
            <h1 className="text-[#989BA2]">Earnings</h1>
            <span className="font-sora text-green-500">$5000</span>
          </div>
          <div className="flex flex-col gap-2 w-full items-end text-xs">
            <h1 className="text-[#989BA2]">Issues</h1>
            <span className="font-sora ">150</span>
          </div>
        </div>
       </motion.div>
      ))}
    </div>
  );
};

export default RightSideLanding;