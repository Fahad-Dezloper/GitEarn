/*
  Warnings:

  - You are about to drop the column `txn` on the `Transaction` table. All the data in the column will be lost.
  - Added the required column `amount` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "BountyStatus" ADD VALUE 'FAILED';

-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "txn",
ADD COLUMN     "amount" INTEGER NOT NULL,
ADD COLUMN     "txnHash" TEXT;
