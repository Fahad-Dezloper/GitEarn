/* eslint-disable @next/next/no-img-element */
"use client"
import { motion } from "motion/react";

const users = [
    {
      username: "@regan",
      avatar: "https://prod-image-cdn.tensor.trade/images/90x90/freeze=false/https%3A%2F%2Fprod-tensor-creators-s3.s3.us-east-1.amazonaws.com%2Fimage%2Fadf0c9f9-8438-4ed3-862a-b82d8f380495",
      badge: "elite",
      issuesSolved: 23,
      earnings: "$1,200",
      top: `-top-[1%]`,
      bottom: `-left-[4%]`,
    },
    {
      username: "@pranayraj",
      avatar: "https://avatars.githubusercontent.com/u/134051033?v=4",
      badge: "rookie",
      issuesSolved: 8,
      earnings: "$300",
      top: `top-[34%]`,
      bottom: `-left-[2%]`,
    },
    {
      username: "@joncodes",
      avatar: "https://avatars.githubusercontent.com/u/146099103?v=4",
      badge: "newbie",
      issuesSolved: 2,
      earnings: "$50",
      top: `top-[18%]`,
      bottom: `left-[27%]`,
    },
    {
      username: "@iamdez",
      avatar: "https://prod-image-cdn.tensor.trade/images/90x90/freeze=false/https%3A%2F%2Fprod-tensor-creators-s3.s3.us-east-1.amazonaws.com%2Fimage%2Fe6811688-3ef2-45d5-9c0e-4aa8c38609a4",
      badge: "elite",
      issuesSolved: 23,
      earnings: "$1,200",
      top: `-top-[1%]`,
      bottom: `left-[57%]`,
    },
    {
      username: "@Fahad-Dezloper",
      avatar: "https://avatars.githubusercontent.com/u/155962781?v=4",
      badge: "rookie",
      issuesSolved: 8,
      earnings: "$300",
      top: `top-[34%]`,
      bottom: `left-[57%]`,
    },
    {
      username: "@Priyanshu",
      avatar: "https://ox35safakaidjuzg.public.blob.vercel-storage.com/yFzI4RTC-Aq7M2Xm6LBoVVrPuyTcsgXJ18f82k1.jpg",
      badge: "newbie",
      issuesSolved: 2,
      earnings: "$50",
      top: `top-[18%]`,
      bottom: `left-[85%]`,
    },
  ];


const RightSideLanding = () => {
  return (
    <div className="relative w-full h-full flex flex-wrap gap-6">
      {users.map((user, i) => (
       <motion.div drag key={i} className={`rounded-xl absolute h-fit ${user.top} ${user.bottom} flex-col flex gap-2 w-[11vw] p-2 bg-black`}>
        <div className="h-[15vh] w-full rounded-md overflow-hidden relative">
            <img src={user.avatar} className="w-full h-full object-cover" alt="user avatar" />
            <div className="absolute bottom-0  w-full flex items-center justify-center">
              <span  className="w-fit px-2 py-0 text-sm bg-black/60 rounded-t-md backdrop-blur-md">{user.badge}</span>
            </div>
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