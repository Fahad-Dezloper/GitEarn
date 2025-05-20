/* eslint-disable @next/next/no-img-element */
"use client";

export default function PoweredBy() {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex items-center bg-muted/60 px-4 py-2 gap-6 rounded-2xl shadow-md border border-white">
        {/* Solana */}
        <div className="flex items-center gap-2">
          {/* Replace the div below with the Solana logo image */}
          <div className="w-6 h-6 ">
            <img src="/LOGO/solana-sol-logo.svg" alt="Solana" className="w-full h-full" />
          </div>
        </div>
        {/* GitHub */}
        <div className="text-muted-foreground text-xl font-black font-sora rounded-full">|</div>
        <div className="flex items-center gap-2">
          {/* Replace the div below with the GitHub logo image */}
          <div className="w-6 h-6 ">
            <img src="/LOGO/github-mark-white.svg" alt="GitHub" className="w-full hidden dark:flex h-full" />
            <img src="/LOGO/github-mark.svg" alt="GitHub" className="w-full flex dark:hidden h-full" />
          </div>
        </div>
      </div>
    </div>
  );
} 