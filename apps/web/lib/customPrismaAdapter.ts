/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-ts-comment */
 
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Adapter } from "next-auth/adapters";
import { Prisma, PrismaClient } from "@prisma/client";
import { generateWalletKeypair } from "./wallet";
import { encrypt } from "@/lib/encryption";

export function CustomPrismaAdapter(prisma: PrismaClient): Adapter {
  return {
    async createUser(userData: any) {
      try {
        console.log("Creating user with data:", JSON.stringify(userData));
        
        const wallet = generateWalletKeypair();
        console.log("Generated wallet publicKey:", wallet.publicKey);
        
        // Check if secretKey exists and is in the expected format
        console.log("Secret key type:", typeof wallet.secretKey);
        if (!wallet.secretKey) {
          console.error("secretKey is undefined or null");
          throw new Error("Failed to generate wallet secret key");
        }
        
        const secretKeyString = wallet.secretKey.toString();
        console.log("Secret key string length:", secretKeyString.length);
        
        // Now encrypt with proper error handling
        const { encryptedData, iv } = encrypt(secretKeyString);
        
        const userWithWallet = await prisma.$transaction(async (tx: any) => {
          const user = await tx.user.create({ data: userData });
          console.log("Created user with ID:", user.id);

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
      } catch (error) {
        console.error("Error in createUser:", error);
        throw error;
      }
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
    
    async linkAccount(account: any) {
      return prisma.account.create({
        data: account,
      });
    },
    
    async unlinkAccount({ providerAccountId, provider }: { providerAccountId: string; provider: string }) {
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
    async createVerificationToken(verificationToken: any) {
      // @ts-ignore
      return prisma.verificationToken.create({
        data: verificationToken,
      });
    },
    async useVerificationToken({ identifier, token }: { identifier: string; token: string }) {
      try {
        // @ts-ignore
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