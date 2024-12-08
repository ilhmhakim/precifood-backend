/*
  Warnings:

  - Added the required column `rank` to the `RecommendationList` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "RecommendationList" ADD COLUMN     "rank" INTEGER NOT NULL;
