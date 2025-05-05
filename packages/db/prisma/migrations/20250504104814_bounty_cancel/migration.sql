/*
  Warnings:

  - You are about to drop the column `state` on the `BountyIssues` table. All the data in the column will be lost.

*/
-- AlterEnum
ALTER TYPE "Status" ADD VALUE 'canceled';

-- AlterTable
ALTER TABLE "BountyIssues" DROP COLUMN "state";

-- CreateTable
CREATE TABLE "Transaction" (
    "id" TEXT NOT NULL,
    "bountyIssueId" TEXT NOT NULL,
    "status" "Status" NOT NULL,
    "txn" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_bountyIssueId_fkey" FOREIGN KEY ("bountyIssueId") REFERENCES "BountyIssues"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
