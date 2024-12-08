/*
  Warnings:

  - You are about to drop the `Ingredient` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `status` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Ingredient" DROP CONSTRAINT "Ingredient_menu_id_fkey";

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "status" VARCHAR(12) NOT NULL;

-- DropTable
DROP TABLE "Ingredient";

-- CreateTable
CREATE TABLE "NutritionSummary" (
    "recommendation_list_id" INTEGER NOT NULL,
    "calory" INTEGER NOT NULL DEFAULT 0,
    "protein" DECIMAL(6,1) NOT NULL DEFAULT 0.0,
    "fat" DECIMAL(6,1) NOT NULL DEFAULT 0.0,
    "carbohydrate" DECIMAL(6,1) NOT NULL DEFAULT 0.0,

    CONSTRAINT "NutritionSummary_pkey" PRIMARY KEY ("recommendation_list_id")
);

-- AddForeignKey
ALTER TABLE "NutritionSummary" ADD CONSTRAINT "NutritionSummary_recommendation_list_id_fkey" FOREIGN KEY ("recommendation_list_id") REFERENCES "RecommendationList"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
