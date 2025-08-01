import { cn } from "@/lib/utils";
import {
  IconCloud,
  IconCurrencyDollar,
  IconEaseInOut,
  IconHelp,
  IconRouteAltLeft,
  IconTerminal2,
} from "@tabler/icons-react";

export default function FeaturesSectionDemo() {
  const features = [
    {
      title: "Open Source First",
      description:
        "Built for open-source contributors who want to get paid doing what they love.",
      icon: <IconTerminal2 />,
    },
    {
      title: "Zero Platform Fees",
      description:
        "GitEarn doesn’t take a cut. Contributors get 100% of what they earn. Always.",
      icon: <IconHelp />,
    },
    {
      title: "On-Chain Reputation",
      description:
        "Your GitHub contributions are tracked and verified on-chain, forever.",
      icon: <IconCloud />,
    },
    {
      title: "Crypto Payouts",
      description:
        "Earn crypto instantly when your PR gets merged. No middlemen. No delays.",
      icon: <IconCurrencyDollar />,
    },
    {
      title: "One-Click Bounty Setup",
      description:
        "Maintainers can attach bounties to any GitHub issue in seconds — no code changes required.",
      icon: <IconEaseInOut />,
    },
    {
      title: "Fully Decentralized",
      description:
        "No central authority. Everything — from bounty assignment to payout — runs on Solana.",
      icon: <IconRouteAltLeft />,
    },
  ];  
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 relative z-10 md:py-10 py-4 w-full">
      {features.map((feature, index) => (
        <Feature key={feature.title} {...feature} index={index} />
      ))}
    </div>
  );
}

const Feature = ({
  title,
  description,
  icon,
  index,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  index: number;
}) => {
  return (
    <div
      className={cn(
        "flex flex-col lg:border-r  py-10 relative group/feature dark:border-neutral-800",
        (index === 0 || index === 3) && "lg:border-l dark:border-neutral-800",
        index < 3 && "lg:border-b dark:border-neutral-800"
      )}
    >
      {index < 3 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-t from-neutral-100 dark:from-neutral-800 to-transparent pointer-events-none" />
      )}
      {index >= 3 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-b from-neutral-100 dark:from-neutral-800 to-transparent pointer-events-none" />
      )}
      <div className="mb-4 relative z-10 px-10 text-neutral-600 dark:text-neutral-400">
        {icon}
      </div>
      <div className="text-lg font-bold mb-2 relative z-10 px-10">
        <div className="absolute left-0 inset-y-0 h-6 group-hover/feature:h-8 w-1 rounded-tr-full rounded-br-full bg-neutral-300 dark:bg-neutral-700 group-hover/feature:bg-blue-500 transition-all duration-200 origin-center" />
        <span className="group-hover/feature:translate-x-2 font-sora transition duration-200 inline-block text-neutral-800 dark:text-neutral-100">
          {title}
        </span>
      </div>
      <p className="text-sm text-neutral-600  dark:text-neutral-300 max-w-xs relative z-10 px-10">
        {description}
      </p>
    </div>
  );
};
