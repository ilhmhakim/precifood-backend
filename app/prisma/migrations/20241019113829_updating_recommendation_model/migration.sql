/*
  Warnings:

  - Added the required column `description` to the `RecommendationList` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total_price` to the `RecommendationList` table without a default value. This is not possible if the table is not empty.
  - Added the required column `image_url` to the `RecommendationListDetail` table without a default value. This is not possible if the table is not empty.
  - Added the required column `menu_category` to the `RecommendationListDetail` table without a default value. This is not possible if the table is not empty.
  - Added the required column `menu_price` to the `RecommendationListDetail` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "RecommendationList" ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "total_price" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "RecommendationListDetail" ADD COLUMN     "image_url" TEXT NOT NULL,
ADD COLUMN     "menu_category" VARCHAR(50) NOT NULL,
ADD COLUMN     "menu_price" INTEGER NOT NULL;
