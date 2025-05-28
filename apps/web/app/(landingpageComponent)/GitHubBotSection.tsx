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
            className="text-[#00BCFF] font-mono text-lg md:text-xl transition-all duration-300"
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
      className="w-full h-full md:px-34 p-4 md:py-4 flex flex-col gap-3"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
    >
      <motion.h2
        className="text-3xl md:text-5xl font-sora font-bold mb-2 text-black dark:text-white"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        Did you know?
      </motion.h2>
      <motion.p
        className="text-lg md:text-2xl text-neutral-600 dark:text-neutral-300 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        You can manage bounties and reward open source contributors directly from GitHub comments!
      </motion.p>
      <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16">
        {/* Left Card */}
        <motion.div
          className="flex-1 bg-white dark:bg-neutral-900 rounded-2xl shadow-lg p-8 md:p-10 border border-neutral-200 dark:border-neutral-800 max-w-xl w-full mb-8 md:mb-0"
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
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
          <Link href="/auth/signin">
            <Button
              size="lg"
              className="w-full cursor-pointer bg-[#00BCFF] hover:bg-[#0099cc] text-white text-lg rounded-full transition-all shadow-md"
            >
              Install GitHub App
            </Button>
          </Link>
        </motion.div>

        {/* Right Chat Bubbles */}
        <motion.div
          className="flex-1 flex flex-col gap-6 w-full max-w-lg"
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
        >
          {/* User comment bubble */}
          <div className="flex items-start gap-3">
            <img
              src="https://avatars.githubusercontent.com/u/1?v=4"
              alt="User avatar"
              className="w-10 h-10 rounded-full border border-neutral-300 dark:border-neutral-700"
            />
            <div className="bg-[#181C20] dark:bg-[#23272b] border border-neutral-800 rounded-xl px-5 py-4 text-white w-full shadow-md">
              <div className="font-semibold text-base mb-1 text-[#00BCFF]">You commented</div>
              <div className="text-base">Wow, awesome work! <span role="img" aria-label="clap">👏</span> <br/>/bounty $50</div>
            </div>
          </div>
          {/* Bot response bubble */}
          <div className="flex items-start gap-3">
            <img
              src="/LOGO/solana-sol-logo.svg"
              alt="Bot avatar"
              className="w-10 h-10 rounded-full border border-[#00BCFF] bg-white dark:bg-black"
            />
            <div className="bg-[#23272b] dark:bg-[#181C20] border border-[#00BCFF] rounded-xl px-5 py-4 text-white w-full shadow-md">
              <div className="font-semibold text-base mb-1 text-[#00BCFF]">GitEarn bot</div>
              <div className="text-base">🎉 <span className="font-bold">@contributor</span> has been awarded <span className="font-bold">$50</span>! 🚀</div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}; 