/*
  Warnings:

  - You are about to drop the column `sodium` on the `Nutrition` table. All the data in the column will be lost.
  - You are about to alter the column `weight_per_portion` on the `Nutrition` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - You are about to alter the column `protein` on the `Nutrition` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(6,1)`.
  - You are about to alter the column `fat` on the `Nutrition` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(6,1)`.
  - You are about to alter the column `carbohydrate` on the `Nutrition` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(6,1)`.
  - You are about to alter the column `cholesterol` on the `Nutrition` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(6,2)`.
  - You are about to alter the column `sfa` on the `Nutrition` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(6,1)`.
  - You are about to alter the column `mufa` on the `Nutrition` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(6,1)`.
  - You are about to alter the column `pufa` on the `Nutrition` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(6,1)`.
  - Added the required column `fiber` to the `Nutrition` table without a default value. This is not possible if the table is not empty.
  - Added the required column `natrium` to the `Nutrition` table without a default value. This is not possible if the table is not empty.
  - Added the required column `weight_with_bdd` to the `Nutrition` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Nutrition" DROP COLUMN "sodium",
ADD COLUMN     "fiber" DECIMAL(6,1) NOT NULL,
ADD COLUMN     "natrium" DECIMAL(6,2) NOT NULL,
ADD COLUMN     "weight_with_bdd" INTEGER NOT NULL,
ALTER COLUMN "weight_per_portion" SET DATA TYPE INTEGER,
ALTER COLUMN "protein" SET DATA TYPE DECIMAL(6,1),
ALTER COLUMN "fat" SET DATA TYPE DECIMAL(6,1),
ALTER COLUMN "carbohydrate" SET DATA TYPE DECIMAL(6,1),
ALTER COLUMN "cholesterol" SET DATA TYPE DECIMAL(6,2),
ALTER COLUMN "sfa" SET DATA TYPE DECIMAL(6,1),
ALTER COLUMN "mufa" SET DATA TYPE DECIMAL(6,1),
ALTER COLUMN "pufa" SET DATA TYPE DECIMAL(6,1);
