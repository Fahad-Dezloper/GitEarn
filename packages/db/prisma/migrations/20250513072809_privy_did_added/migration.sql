/*
  Warnings:

  - You are about to drop the `Wallet` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[privyDID]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[solanaAddress]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Wallet" DROP CONSTRAINT "Wallet_userId_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "privyDID" TEXT,
ADD COLUMN     "solanaAddress" TEXT;

-- DropTable
DROP TABLE "Wallet";

-- CreateIndex
CREATE UNIQUE INDEX "User_privyDID_key" ON "User"("privyDID");

-- CreateIndex
CREATE UNIQUE INDEX "User_solanaAddress_key" ON "User"("solanaAddress");
