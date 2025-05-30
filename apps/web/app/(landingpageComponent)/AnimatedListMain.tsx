"use client";

import { cn } from "@/lib/utils";
import { AnimatedList } from "@/components/magicui/animated-list";

let notifications = [
  {
    name: "Add unit tests for API endpoints",
    description: "Repository: rest-api",
    labels: ["testing", "backend", "documentation"],
    time: "15m ago",
    icon: "🏹",
  },
  {
    name: "Implement OAuth2 authentication",
    description: "Repository: auth-service",
    labels: ["security", "backend"],
    time: "10m ago",
    icon: "🔐",
  },
  {
    name: "Create API documentation",
    description: "Repository: docs",
    labels: ["documentation", "frontend"],
    time: "5m ago",
    icon: "📚",
  },
  {
    name: "Fix performance issues",
    description: "Repository: main-app",
    labels: ["performance", "bug"],
    time: "2m ago",
    icon: "⚡",
  },
];

notifications = Array.from({ length: 10 }, () => notifications).flat();

interface Item {
  name: string;
  description: string;
  labels: string[];
  icon: string;
  time: string;
}

const Notification = ({ name, description, labels, icon, time }: Item) => {
  return (
    <figure
      className={cn(
        "relative mx-auto min-h-fit w-full max-w-[400px] cursor-pointer overflow-hidden rounded-2xl p-4",
        // animation styles
        "transition-all duration-200 ease-in-out hover:scale-[103%]",
        // light styles
        "bg-white [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)]",
        // dark styles
        "transform-gpu dark:bg-transparent dark:backdrop-blur-md dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset]",
      )}
    >
      <div className="flex flex-row items-start gap-3">
        <div className="flex size-10 items-center justify-center">
          <span className="text-2xl">{icon}</span>
        </div>
        <div className="flex flex-col overflow-hidden">
          <figcaption className="flex flex-row items-center whitespace-pre text-lg font-medium dark:text-white">
            <span className="text-sm sm:text-lg">{name}</span>
            <span className="mx-1">·</span>
            <span className="text-xs text-gray-500">{time}</span>
          </figcaption>
          <p className="text-sm font-normal dark:text-white/60">
            {description}
          </p>
          <div className="mt-2 flex flex-wrap gap-1">
            {labels.map((label, index) => (
              <span
                key={index}
                className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-300"
              >
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </figure>
  );
};

export function AnimatedListMain({
  className,
}: {
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative flex h-[500px] w-full flex-col overflow-hidden p-2",
        className,
      )}
    >
      <AnimatedList>
        {notifications.map((item, idx) => (
          <Notification {...item} key={idx} />
        ))}
      </AnimatedList>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-background"></div>
    </div>
  );
}
