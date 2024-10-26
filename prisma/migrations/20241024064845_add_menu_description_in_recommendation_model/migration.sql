/*
  Warnings:

  - Added the required column `menu_description` to the `RecommendationListDetail` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "RecommendationListDetail" ADD COLUMN     "menu_description" TEXT NOT NULL;
