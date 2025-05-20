/* eslint-disable @next/next/no-img-element */
import { ModeToggle } from "@/components/Toggle";
import { GithubIcon } from "@/components/ui/github";
import PoweredBy from "@/components/ui/PoweredBy";
import { TwitterIcon } from "@/components/ui/twitter";
import Link from "next/link";

export default function GitEarnFooter() {
  return (
    <footer className="px-4 md:px-8 lg:px-34 py-8 md:py-12 border-t">
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-16 lg:gap-32 text-sm">
        {/* Brand Section */}
        <div className="flex flex-col gap-3">
          <div>
              <img src="/LOGO/GITEARN.svg" alt="GitEarn Logo" className="h-6 mb-3" />
          </div>
          <p className="leading-relaxed text-wrap max-w-md">
            GitEarn is a decentralized bounty platform rewarding open-source contributions.
          </p>
          <span className="">
            Builder <Link href={"https://x.com/dezloperr"} className="text-sky-400 hover:underline font-semibold font-sora">Fahad/Dezloper</Link>
          </span>
        </div>

        {/* Links Section */}
        <div className="grid whitespace-nowrap grid-cols-2 md:flex gap-8 md:gap-16 lg:gap-32">
          {/* Product */}
          <div className="flex flex-col gap-4 md:gap-6">
            <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 md:mb-2">Product</h3>
            <ul className="flex flex-col gap-2 md:gap-3 ">
              <li><Link href="/chrome" className="hover:underline hover:text-sky-600 dark:hover:text-sky-400 transition ">Chrome Extension</Link></li>
              <li><Link href="/shortcut" className="hover:underline hover:text-sky-600 dark:hover:text-sky-400 transition ">iOS Shortcut</Link></li>
            </ul>
          </div>

          {/* Community */}
          <div className="flex flex-col gap-4 md:gap-6">
            <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 md:mb-2">Community</h3>
            <ul className="flex flex-col gap-2 md:gap-3 ">
              <li><a href="https://discord.gg/" target="_blank" rel="noreferrer" className="hover:underline hover:text-sky-600 dark:hover:text-sky-400 transition">Discord</a></li>
              <li><Link href="/issues" className="hover:underline hover:text-sky-600 dark:hover:text-sky-400 transition">Report Issue</Link></li>
              <li><Link href="/support" className="hover:underline hover:text-sky-600 dark:hover:text-sky-400 transition">Get Help</Link></li>
            </ul>
          </div>

          {/* OpenSource */}
          <div className="flex flex-col md:items-center gap-4 md:gap-6">
            <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 md:mb-2">OpenSource</h3>
            <ul className="flex gap-3">
              <li>
                <Link href="/terms" className="hover:underline hover:text-sky-600 dark:hover:text-sky-400 transition">
                  <GithubIcon size={20} className="rounded-full border-2 border-slate-300 p-2 md:p-3" />
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:underline hover:text-sky-600 dark:hover:text-sky-400 transition">
                  <TwitterIcon size={20} className="rounded-full border-2 border-slate-300 p-2 md:p-3" />
                </Link>
              </li>
            </ul>
          </div>


{/* powered by and mode toggle */}
          <div className="flex flex-col gap-4 items-center md:gap-6">
            <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 md:mb-2">Porwered By</h3>
            <div className="flex flex-col gap-6">
            <PoweredBy />
            <ModeToggle />
            </div>
          </div>
        </div>
      </div>

      {/* Footer bottom */}
      <div className="w-full mt-8 md:mt-10 flex flex-col md:flex-row items-center justify-center md:justify-end border-t border-slate-200 dark:border-slate-700 pt-6">
        <p className="text-xs text-slate-500 dark:text-slate-400 text-center md:text-left">
          © {new Date().getFullYear()} GitEarn, Inc. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
