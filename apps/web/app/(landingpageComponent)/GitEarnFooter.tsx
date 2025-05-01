import { GithubIcon } from "@/components/ui/github";
import { TwitterIcon } from "@/components/ui/twitter";
import Link from "next/link";

export default function GitEarnFooter() {
  return (
    <footer className="px-34 py-12 border-t">
      <div className=" w-full grid grid-cols-4 gap-32 text-sm">
        <div className="flex flex-col gap-3">
          <div className="">
            <h2 className="text-3xl font-semibold dark:text-white font-sora">GitEarn</h2>
          </div>
          <p className="leading-relaxed text-wrap">
            GitEarn is a decentralized bounty platform rewarding open-source contributions.
          </p>

          <span className="whitespace-nowrap">Builder <Link href={"https://x.com/dezloperr"} className="text-sky-400 hover:underline font-semibold font-sora">Fahad/Dezloper</Link></span>
        </div>

        <div className="flex gap-32">
        {/* Product */}
        <div className="flex flex-col gap-6 whitespace-nowrap">
          <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Product</h3>
          <ul className="flex flex-col gap-3">
            {/* <li><Link href="/docs" className="hover:underline hover:text-sky-600 dark:hover:text-sky-400 transition">Documentation</Link></li> */}
            <li><Link href="/chrome" className="hover:underline hover:text-sky-600 dark:hover:text-sky-400 transition">Chrome Extension</Link></li>
            <li><Link href="/shortcut" className="hover:underline hover:text-sky-600 dark:hover:text-sky-400 transition">iOS Shortcut</Link></li>
          </ul>
        </div>

        {/* Community */}
        <div className="flex flex-col gap-6 whitespace-nowrap">
          <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Community</h3>
          <ul className="flex flex-col gap-3">
            <li><a href="https://discord.gg/" target="_blank" rel="noreferrer" className="hover:underline hover:text-sky-600 dark:hover:text-sky-400 transition">Discord</a></li>
            <li><Link href="/issues" className="hover:underline hover:text-sky-600 dark:hover:text-sky-400 transition">Report Issue</Link></li>
            <li><Link href="/support" className="hover:underline hover:text-sky-600 dark:hover:text-sky-400 transition">Get Help</Link></li>
          </ul>
        </div>

        {/* OpenSource */}
        <div className="flex flex-col items-center gap-6 whitespace-nowrap">
          <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">OpenSource</h3>
          <ul className="flex gap-3">
            <li><Link href="/terms" className="hover:underline hover:text-sky-600 dark:hover:text-sky-400 transition"><GithubIcon size={24} className="rounded-full border-2 border-slate-300 p-3" /></Link></li>
            <li><Link href="/privacy" className="hover:underline hover:text-sky-600 dark:hover:text-sky-400 transition "><TwitterIcon size={24} className="rounded-full border-2 border-slate-300 p-3 " /></Link></li>
          </ul>
        </div>


        {/* Legal */}
        {/* <div className="flex flex-col gap-6 whitespace-nowrap">
          <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Legal</h3>
          <ul className="flex flex-col gap-3">
            <li><Link href="/terms" className="hover:underline hover:text-sky-600 dark:hover:text-sky-400 transition">Terms of Service</Link></li>
            <li><Link href="/privacy" className="hover:underline hover:text-sky-600 dark:hover:text-sky-400 transition">Privacy Policy</Link></li>
          </ul>
        </div> */}
        </div>
      </div>

      {/* Footer bottom */}
      <div className=" w-full mt-10 flex flex-col md:flex-row items-center justify-end border-t border-slate-200 dark:border-slate-700 pt-6">
        <p className="text-xs text-slate-500 dark:text-slate-400">
          © {new Date().getFullYear()} GitEarn, Inc. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
