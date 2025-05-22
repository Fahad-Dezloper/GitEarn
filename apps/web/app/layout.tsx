import type { Metadata } from "next";
import { Sora, Roboto } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner"
import { Providers } from "@/provider/Provider";
import PrivyProviderr from "@/provider/PrivyProvider";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
});

const roboto = Roboto({
  weight: ["100", "300", "400", "500", "700", "900"],
  subsets: ["latin"],
  variable: "--font-roboto",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://gitearn.com"),
  title: "GITEARN - Earn Rewards for Solving GitHub Issues",
  description: "Git Earn turns GitHub issues into earning opportunities. Built on Solana, it empowers maintainers to post bounties and contributors to get paid for solving real problems—no proposals, no freelancing, just clean code and fair rewards.",
  keywords: ["GitHub", "Solana", "Bounties", "Open Source", "Developer Platform", "Blockchain", "Web3", "Programming", "Coding", "Developer Rewards"],
  authors: [{ name: "GITEARN" }],
  openGraph: {
    title: "GITEARN - Earn Rewards for Solving GitHub Issues",
    description: "Git Earn turns GitHub issues into earning opportunities. Built on Solana, it empowers maintainers to post bounties and contributors to get paid for solving real problems.",
    url: "https://gitearn.com",
    siteName: "GITEARN",
    images: [
      {
        url: "https://ox35safakaidjuzg.public.blob.vercel-storage.com/GITEARN-nfCZb9sfstAi694FqKBDthGNW8vYu9.svg",
        width: 800,
        height: 600,
        alt: "GITEARN Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "GITEARN - Earn Rewards for Solving GitHub Issues",
    description: "Git Earn turns GitHub issues into earning opportunities. Built on Solana, it empowers maintainers to post bounties and contributors to get paid for solving real problems.",
    images: ["/GITEARN.svg"],
  },
  icons: {
    icon: [
      { url: "/favicon_io/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon_io/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/favicon_io/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      { rel: "manifest", url: "/favicon_io/site.webmanifest" },
    ],
  },
  robots: "index, follow",
  alternates: {
    canonical: "https://gitearn.com",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script defer src="https://cloud.umami.is/script.js" data-website-id="e17cb602-aa41-40d3-9a36-dac8a67b9525"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "rkgiqr5nt0");
            `
          }}
        />
        </head>
      <body
        className={`${sora.variable} ${roboto.variable} font-roboto antialiased relative`}
      >
        <Providers>
          <ThemeProvider 
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
           <PrivyProviderr> 
          {children}
          </PrivyProviderr>
          <Toaster />
          </ThemeProvider>
          </Providers>
      </body>
    </html>
  );
}
