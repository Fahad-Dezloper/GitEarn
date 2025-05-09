/* eslint-disable @next/next/no-img-element */
import { cn } from "@/lib/utils";
import { Marquee } from "@/components/magicui/marquee";
import { reviews } from "@/lib/testimonials";
import Link from "next/link";

// console.log("reviews fetched", reviews);

const firstRow = reviews.slice(0, reviews.length / 2);
const secondRow = reviews.slice(reviews.length / 2);
const thirdRow = reviews.slice(reviews.length / 2);

const ReviewCard = ({
  img,
  name,
  username,
  body,
  link
}: {
  img: string;
  name: string;
  username: string;
  body: string;
  link: string
}) => {
  return (
    <figure
      className={cn(
        "relative  flex flex-col gap-4 h-fit justify-between md:max-w-[25vw] w-full cursor-pointer overflow-hidden rounded-xl border p-4",
        // light styles
        "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
        // dark styles
        "dark:border-[#262629] dark:bg-[#262629]/60 dark:hover:bg-[#262629]/80"
      )}
    >
      <div className="flex items-center justify-between w-full">
        <div className="flex flex-row items-center gap-2">
          <img className="rounded-full" width="45" height="45" alt="" src={img} />
          <div className="flex flex-col">
            <figcaption className="text-base font-medium dark:text-white">
              {name}
            </figcaption>
            <p className="text-xs font-medium dark:text-white/40">{username}</p>
          </div>
        </div>
        <Link href={link} className="font-sora text-xl">𝕏</Link>
      </div>
      <blockquote className="text-sm">{body}</blockquote>
    </figure>
  );
};

export function Testimonials() {
  return (
    <div className="relative flex gap-6 h-[700px] w-full flex-row items-center justify-center overflow-hidden">
      <Marquee pauseOnHover vertical className="[--duration:20s] flex flex-col gap-4">
        {firstRow.map((review, i) => (
          <ReviewCard key={i} {...review} />
        ))}
      </Marquee>
      <Marquee pauseOnHover vertical className="[--duration:25s] hidden md:flex flex-col gap-4">
        {secondRow.map((review, i) => (
          <ReviewCard key={i} {...review} />
        ))}
      </Marquee>
      <Marquee pauseOnHover vertical className="[--duration:20s] hidden md:flex flex-col gap-4">
        {thirdRow.map((review, i) => (
          <ReviewCard key={i} {...review} />
        ))}
      </Marquee>
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-background"></div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-background"></div>
    </div>
  );
}
