/*
  Warnings:

  - Added the required column `menu_name` to the `RecommendationListDetail` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "RecommendationListDetail" ADD COLUMN     "menu_name" VARCHAR(255) NOT NULL;
