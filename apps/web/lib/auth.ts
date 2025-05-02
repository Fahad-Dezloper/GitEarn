import GithubProvider from "next-auth/providers/github";
import { NextAuthOptions } from "next-auth";
import prisma from '@repo/db/client';
import { CustomPrismaAdapter } from "@/lib/customPrismaAdapter";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  adapter: CustomPrismaAdapter(prisma),
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
        token.tokenType = account.token_type;
        token.scope = account.scope;
      }
  
      return token; 
    },
  
    async session({ session, token }) {
      if (token.user) {
        session.user = token.user;
      }
  
      if (token.accessToken) {
        session.accessToken = token.accessToken as string;
        session.scope = token.scope as string;
      }

      if (session.user?.email) {
        const user = await prisma.user.findUnique({
          where: { email: session.user.email },
          include: { wallet: true }
        });
        
        if (user?.wallet) {
          session.user.walletPublicKey = user.wallet.publicKey;
        }
      }

      return session;
    },
  }
};