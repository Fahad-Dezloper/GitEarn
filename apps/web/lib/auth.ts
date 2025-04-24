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
      authorization: {
        params: {
          scope: "read:user user:email public_repo"
        }
      }
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.user = {
          name: user.name,
          email: user.email,
          image: user.image,
        };
      }
  
      if (account) {
        token.accessToken = account.access_token;
      }
  
      return token; 
    },
  
    async session({ session, token }) {
      // console.log("Session callback - session:", session);
      // console.log("Session callback - token:", token);
  
      if (!token) {
        console.error("Token is undefined in session callback!");
        return session;
      }
  
      if (token.user) {
        session.user = token.user;
      }
  
      if (token.accessToken) {
        session.accessToken = token.accessToken as string;
      }

      return session;
    },
  }
};