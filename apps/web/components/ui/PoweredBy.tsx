/* eslint-disable @next/next/no-img-element */
"use client";

export default function PoweredBy() {
  return (
    <div className="flex flex-col items-center justify-center py-8">
      <span className="uppercase text-xs tracking-widest text-muted-foreground mb-2">Powered by</span>
      <div className="flex items-center gap-8 bg-muted/60 px-8 py-4 rounded-2xl shadow-md border border-border">
        {/* Solana */}
        <div className="flex items-center gap-2">
          {/* Replace the div below with the Solana logo image */}
          <div className="w-8 h-8 ">
            <img src="/LOGO/solana-sol-logo.svg" alt="Solana" className="w-8 h-8" />
          </div>
          <span className="font-semibold text-base text-foreground">Solana</span>
        </div>
        <span className="text-muted-foreground text-xl font-black font-sora">|</span>
        {/* GitHub */}
        <div className="flex items-center gap-2">
          {/* Replace the div below with the GitHub logo image */}
          <div className="w-8 h-8 ">
            <img src="/LOGO/github-mark-white.svg" alt="GitHub" className="w-8 h-8" />
          </div>
          <span className="font-semibold text-base text-foreground">GitHub</span>
        </div>
      </div>
    </div>
  );
} 