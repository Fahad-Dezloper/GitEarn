/*
  Warnings:

  - Added the required column `state` to the `BountyIssues` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Status" AS ENUM ('pending', 'confirmed');

-- AlterTable
ALTER TABLE "BountyIssues" ADD COLUMN     "state" "Status" NOT NULL;
