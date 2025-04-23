/*
  Warnings:

  - You are about to drop the column `repositoryId` on the `BountyIssues` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "BountyIssues" DROP COLUMN "repositoryId",
ALTER COLUMN "githubId" SET DATA TYPE BIGINT;
