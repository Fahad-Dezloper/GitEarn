/*
  Warnings:

  - Added the required column `iv` to the `Wallet` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Wallet" ADD COLUMN     "iv" TEXT NOT NULL;
