/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @next/next/no-img-element */
// @ts-nocheck
import { cn } from "@/lib/utils";
import { Marquee } from "@/components/magicui/marquee";
import { reviews } from "@/lib/authTesti";
import Link from "next/link";

type CardData =
  | {
      type: "testimonial";
      img: string;
      name: string;
      username: string;
      body: string;
      link: string;
    }
  | {
      type: "bounty";
      title: string;
      repository: string;
      repoUrl: string;
      labels: string[];
      createdAt: string;
      bountyAmount: number;
    }
  | {
      type: "payout";
      username: string;
      amount: number;
      date: string;
      bountyTitle: string;
      repo: string;
    };
// console.log("reviews fetched", reviews);

const firstRow = reviews.slice(0, reviews.length / 2);
const secondRow = reviews.slice(reviews.length / 2);
const thirdRow = reviews.slice(reviews.length / 2);

const ReviewCard = (data: CardData) => {
  return (
    <figure
    className={cn(
      "relative flex flex-col gap-4 h-fit justify-between max-w-[25vw] cursor-pointer overflow-hidden rounded-xl border p-4",
      "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
      "dark:border-[#262629] dark:bg-[#262629]/60 dark:hover:bg-[#262629]/80"
    )}
  >
    {data.type === "testimonial" && (
      <>
        <div className="flex items-center justify-between w-full">
          <div className="flex flex-row items-center gap-2">
            <img
              className="rounded-full"
              width="45"
              height="45"
              alt=""
              src={data.img}
            />
            <div className="flex flex-col">
              <figcaption className="text-base font-medium dark:text-white">
                {data.name}
              </figcaption>
              <p className="text-xs font-medium dark:text-white/40">
                {data.username}
              </p>
            </div>
          </div>
          <Link href={data.link} className="font-sora text-xl">
            𝕏
          </Link>
        </div>
        <blockquote className="text-sm">{data.body}</blockquote>
      </>
    )}

    {data.type === "bounty" && (
      <>
        <div className="flex flex-col gap-1">
          <figcaption className="text-base font-semibold dark:text-white">
            🏹 {data.title}
          </figcaption>
          <p className="text-xs font-medium text-gray-500 dark:text-white/40">
            Repository:{" "}
            <a href={data.repoUrl} className="underline">
              {data.repository}
            </a>
          </p>
          <div className="flex flex-wrap gap-1 text-xs mt-1">
            {data.labels.map((label) => (
              <span
                key={label}
                className="bg-gray-200 dark:bg-white/10 px-2 py-0.5 rounded-full"
              >
                {label}
              </span>
            ))}
          </div>
        </div>
        <blockquote className="text-sm text-gray-600 dark:text-white/70">
          💰 ${data.bountyAmount} bounty — Created on{" "}
          {new Date(data.createdAt).toLocaleDateString()}
        </blockquote>
      </>
    )}

    {data.type === "payout" && (
      <>
        <div className="flex items-center justify-between w-full">
          <div className="flex flex-col">
            <figcaption className="text-base font-medium dark:text-white">
              💸 {data.bountyTitle}
            </figcaption>
            <p className="text-xs font-medium text-gray-500 dark:text-white/40">
              {data.repo}
            </p>
          </div>
          <p className="text-sm font-semibold text-green-600 dark:text-green-400">
            +${data.amount}
          </p>
        </div>
        <blockquote className="text-sm text-gray-600 dark:text-white/70">
          Paid to <span className="font-medium">{data.username}</span> on{" "}
          {new Date(data.date).toLocaleDateString()}
        </blockquote>
      </>
    )}
  </figure>
  );
};

export function AuthTesti() {
  return (
    <div className="relative flex gap-6 h-full w-full flex-row items-center justify-center overflow-hidden">
      <Marquee pauseOnHover vertical className="[--duration:35s]">
        {firstRow.map((review, i) => (
          <ReviewCard key={i} {...review} />
        ))}
      </Marquee>
      <Marquee pauseOnHover vertical className="[--duration:40s]">
        {secondRow.map((review, i) => (
          <ReviewCard key={i} {...review} />
        ))}
      </Marquee>
      <Marquee pauseOnHover vertical className="[--duration:35s] ">
        {thirdRow.map((review, i) => (
          <ReviewCard key={i} {...review} />
        ))}
      </Marquee>
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-background"></div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-background"></div>
    </div>
  );
}
