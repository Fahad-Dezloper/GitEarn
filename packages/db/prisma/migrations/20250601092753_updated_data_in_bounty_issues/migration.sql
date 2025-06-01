/*
  Warnings:

  - Added the required column `repoName` to the `BountyIssues` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `BountyIssues` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BountyIssues" ADD COLUMN     "repoName" TEXT NOT NULL,
ADD COLUMN     "technologies" TEXT[],
ADD COLUMN     "title" TEXT NOT NULL;
