/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Adapter } from "next-auth/adapters";
import { PrismaClient } from "@prisma/client";
import { generateWalletKeypair } from "./wallet";
import { encrypt } from "@/lib/encryption";

export function CustomPrismaAdapter(prisma: PrismaClient): Adapter {
  return {
    async createUser(userData: any) {
      const wallet = generateWalletKeypair();
      const { encryptedData, iv } = encrypt(wallet.secretKey);

      const userWithWallet = await prisma.$transaction(async (tx) => {
        const user = await tx.user.create({ data: userData });

        await tx.wallet.create({
          data: {
            userId: user.id,
            publicKey: wallet.publicKey,
            secretKey: encryptedData,
            iv
          },
        });
        return user;
      });

      return userWithWallet;
    },
    
    async getUser(id) {
      return prisma.user.findUnique({ where: { id } });
    },
    
    async getUserByEmail(email) {
      return prisma.user.findUnique({ where: { email } });
    },
    
    async getUserByAccount({ providerAccountId, provider }) {
      const account = await prisma.account.findUnique({
        where: {
          provider_providerAccountId: {
            provider,
            providerAccountId,
          },
        },
        include: { user: true },
      });
      return account?.user ?? null;
    },
    
    async updateUser(user) {
      return prisma.user.update({
        where: { id: user.id },
        data: user,
      });
    },
    
    async deleteUser(userId) {
      return prisma.user.delete({
        where: { id: userId },
      });
    },
    
    async linkAccount(account) {
      return prisma.account.create({
        data: account,
      });
    },
    
    async unlinkAccount({ providerAccountId, provider }) {
      return prisma.account.delete({
        where: {
          provider_providerAccountId: {
            provider,
            providerAccountId,
          },
        },
      });
    },
    
    async createSession(session) {
      return prisma.session.create({
        data: session,
      });
    },
    
    async getSessionAndUser(sessionToken) {
      const userAndSession = await prisma.session.findUnique({
        where: { sessionToken },
        include: { user: true },
      });
      if (!userAndSession) return null;
      const { user, ...session } = userAndSession;
      return { user, session };
    },
    
    async updateSession(session) {
      return prisma.session.update({
        where: { sessionToken: session.sessionToken },
        data: session,
      });
    },
    
    async deleteSession(sessionToken) {
      return prisma.session.delete({
        where: { sessionToken },
      });
    },
    
    async createVerificationToken(verificationToken) {
      return prisma.verificationToken.create({
        data: verificationToken,
      });
    },
    
    async useVerificationToken({ identifier, token }) {
      try {
        return await prisma.verificationToken.delete({
          where: {
            identifier_token: {
              identifier,
              token,
            },
          },
        });
      } catch (error) {
        return null;
      }
    },
  };
}