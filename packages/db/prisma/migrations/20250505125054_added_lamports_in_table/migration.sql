/*
  Warnings:

  - You are about to drop the column `bounty` on the `BountyIssues` table. All the data in the column will be lost.
  - You are about to drop the column `amount` on the `Transaction` table. All the data in the column will be lost.
  - Added the required column `bountyAmount` to the `BountyIssues` table without a default value. This is not possible if the table is not empty.
  - Added the required column `bountyAmountInLamports` to the `BountyIssues` table without a default value. This is not possible if the table is not empty.
  - Added the required column `bountyAmount` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `bountyAmountInLamports` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BountyIssues" DROP COLUMN "bounty",
ADD COLUMN     "bountyAmount" INTEGER NOT NULL,
ADD COLUMN     "bountyAmountInLamports" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "amount",
ADD COLUMN     "bountyAmount" INTEGER NOT NULL,
ADD COLUMN     "bountyAmountInLamports" INTEGER NOT NULL;
