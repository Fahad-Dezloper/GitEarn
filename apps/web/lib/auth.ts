import GithubProvider from "next-auth/providers/github";
import { NextAuthOptions } from "next-auth";
import prisma from '@repo/db/client';
import { PrismaAdapter } from "@next-auth/prisma-adapter"

if (!process.env.AUTH_GITHUB_ID) throw new Error("Missing AUTH_GITHUB_ID env variable");
if (!process.env.AUTH_GITHUB_SECRET) throw new Error("Missing AUTH_GITHUB_SECRET env variable");
if (!process.env.AUTH_SECRET) throw new Error("Missing AUTH_SECRET env variable");

export const authOptions: NextAuthOptions = {
  secret: process.env.AUTH_SECRET || "",
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
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account && profile) {
        token.githubUsername = profile.login;
      }
      return token;
    },
    async session({ session, token }) {
      if (token.githubUsername) {
        session.user.githubUsername = token.githubUsername;
      }
      return session;
    }
  },
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
    newUser: '/auth/new-user'
  }
};