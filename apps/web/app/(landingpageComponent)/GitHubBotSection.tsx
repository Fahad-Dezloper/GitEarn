import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const commands = [
  "/bounty $50",
  "/tip $50 @johndoe",
  "/attempt",
  "/approve",
  "/cancel",
  "/help"
];

function RotatingCommand() {
  const [index, setIndex] = useState(0);
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => setShow(false), 1500);
    const interval = setInterval(() => {
      setShow(true);
      setIndex((prev) => (prev + 1) % commands.length);
    }, 1800);
    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (!show) {
      const timeout = setTimeout(() => setShow(true), 300);
      return () => clearTimeout(timeout);
    }
  }, [show]);

  return (
    <span className="inline-block min-w-[9ch] align-middle">
      <AnimatePresence mode="wait" initial={false}>
        {show && (
          <motion.span
            key={commands[index]}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3 }}
            className="text-[#00BCFF]  font-sora text-lg md:text-xl transition-all duration-300"
          >
            {commands[index]}
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}

export const GitHubBotSection = () => {
  return (
    <motion.section
      className="w-full h-full md:px-34 p-4 md:py-4 flex flex-col md:gap-3 gap-2 mb-8 md:mb-0"
    >
      <motion.h2
        className="text-3xl md:text-5xl font-sora font-bold mb-2 text-black dark:text-white"
      >
        Did you know?
      </motion.h2>
      <motion.p
        className="text-sm md:text-2xl text-neutral-600 dark:text-neutral-300 mb-8"
      >
        You can manage bounties and reward open source contributors directly from GitHub comments!
      </motion.p>
      <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16">
        {/* Left Card - Hidden on mobile */}
        <motion.div
          className="hidden md:flex flex-1 bg-white dark:bg-neutral-900 rounded-2xl dark::shadow-lg p-8 md:dark:p-10 dark:border border-neutral-200 dark:border-neutral-800 max-w-xl w-full mb-8 md:mb-0"
        >
          <div className="w-full">
            <h3 className="text-xl md:text-3xl font-semibold mb-2 text-black dark:text-white">
              Use the GitEarn bot <span className="text-[#00BCFF]">instantly</span>
            </h3>
            <p className="text-base md:text-lg text-neutral-600 dark:text-neutral-400 mb-6">
              Add, Attempt, Tip Bounties is now as easy as <br /> <RotatingCommand />
            </p>
            <ul className="mb-8 space-y-2">
              <li className="flex items-center gap-2 text-neutral-700 dark:text-neutral-300 text-base md:text-lg">
                <span className="text-[#00BCFF] text-lg">✓</span> Add bounties with a single comment
              </li>
              <li className="flex items-center gap-2 text-neutral-700 dark:text-neutral-300 text-base md:text-lg">
                <span className="text-[#00BCFF] text-lg">✓</span> Claim, check status, and more
              </li>
              <li className="flex items-center gap-2 text-neutral-700 dark:text-neutral-300 text-base md:text-lg">
                <span className="text-[#00BCFF] text-lg">✓</span> GitEarn handles rewards and payouts
              </li>
            </ul>
            <Link href="/auth/signin" className="w-full flex items-center justify-center">
              <Button
                size="lg"
                className="w-fit cursor-pointer bg-[#00BCFF] hover:bg-[#0099cc] text-white text-lg rounded-full transition-all shadow-md"
              >
                Install GitHub App
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Right Chat Bubbles with Mobile Overlay */}
        <motion.div
          className="flex-1 flex relative"
        >
          <div className="relative w-full">
            <img 
              src="/github-bot-image.png" 
              className="h-full w-full md:scale-110 hidden dark:block rounded-2xl shadow-lg" 
              alt="GitHub Bot" 
            />
            <div className="dark:hidden flex p-2 w-full h-full rounded-2xl bg-[#0D1117] md:scale-110 shadow-lg">
              <img 
                src="/github-bot-image-white.png" 
                className="h-full w-full object-cover rounded-2xl" 
                alt="GitHub Bot" 
              />
            </div>
            
            {/* Mobile Overlay Text - More Compact */}
            <div className="md:hidden absolute -bottom-6 left-0 right-0 p-4 bg-gradient-to-t from-white/90 via-white/50 to-transparent dark:from-black/90 dark:via-black/50 h-32">
              <div className="flex flex-col items-center justify-end h-full">
                <p className=" text-white/90 mb-2 text-center">
                  Try <span className="text-[#00BCFF] font-sora"><RotatingCommand /></span>
                </p>
                <Link href="/auth/signin" className="w-full flex items-center justify-center">
                  <Button
                    size="sm"
                    className="w-fit cursor-pointer bg-[#00BCFF] hover:bg-[#0099cc] text-white text-sm rounded-full transition-all shadow-md"
                  >
                    Install GitHub App
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}; 