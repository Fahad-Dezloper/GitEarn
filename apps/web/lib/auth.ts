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
          scope: "read:user user:email"
        }
      }
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
    // error: '/auth/error',
    // verifyRequest: '/auth/verify-request',
    newUser: '/auth/new-user'
  }
};