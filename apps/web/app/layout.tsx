import type { Metadata } from "next";
import { Sora, Roboto } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner"
import { Providers } from "@/provider/Provider";


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
  title: "Git Earn",
  description: "Make money by contributing to open source projects",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en" suppressHydrationWarning>
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
          {children}
          <Toaster />
          </ThemeProvider>
          </Providers>
      </body>
    </html>
  );
}
