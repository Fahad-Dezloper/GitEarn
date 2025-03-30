import GithubProvider from "next-auth/providers/github";
import { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from '@repo/db/client';

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    GithubProvider({
      clientId: process.env.AUTH_GITHUB_ID || "",
      clientSecret: process.env.AUTH_GITHUB_SECRET || "",
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      // console.log("JWT callback - before update:", token);
  
      if (user) {
        token.user = {
          name: user.name,
          email: user.email,
          image: user.image,
        };
      }
  
      // If using OAuth (GitHub), store access token
      if (account) {
        token.accessToken = account.access_token;
      }
  
      // console.log("JWT callback - after update:", token);
      return token; 
    },
  
    async session({ session, token }) {
      // console.log("Session callback - session:", session);
      // console.log("Session callback - token:", token);
  
      if (!token) {
        console.error("Token is undefined in session callback!");
        return session; // Return session without modifications to prevent crash
      }
  
      // Ensure session.user contains user data
      if (token.user) {
        session.user = token.user;
      }
  
      // Ensure session includes accessToken
      if (token.accessToken) {
        session.accessToken = token.accessToken as string;
      }

      return session;
    },
  }
};