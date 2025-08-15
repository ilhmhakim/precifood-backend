/*
  Warnings:

  - You are about to alter the column `calory` on the `MasterBahan` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(65,30)`.
  - You are about to alter the column `calory` on the `MasterBumbu` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(65,30)`.
  - You are about to alter the column `calory` on the `Nutrition` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `Decimal(6,1)`.
  - You are about to alter the column `calory` on the `NutritionSummary` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `Decimal(6,1)`.

*/
-- AlterTable
ALTER TABLE "MasterBahan" ALTER COLUMN "calory" SET DEFAULT 0.0,
ALTER COLUMN "calory" SET DATA TYPE DECIMAL(65,30),
ALTER COLUMN "protein" SET DATA TYPE DECIMAL(65,30),
ALTER COLUMN "fat" SET DATA TYPE DECIMAL(65,30),
ALTER COLUMN "carbohydrate" SET DATA TYPE DECIMAL(65,30),
ALTER COLUMN "fiber" SET DATA TYPE DECIMAL(65,30),
ALTER COLUMN "natrium" SET DATA TYPE DECIMAL(65,30),
ALTER COLUMN "cholesterol" SET DATA TYPE DECIMAL(65,30),
ALTER COLUMN "sfa" SET DATA TYPE DECIMAL(65,30),
ALTER COLUMN "mufa" SET DATA TYPE DECIMAL(65,30),
ALTER COLUMN "pufa" SET DATA TYPE DECIMAL(65,30);

-- AlterTable
ALTER TABLE "MasterBumbu" ALTER COLUMN "calory" SET DEFAULT 0.0,
ALTER COLUMN "calory" SET DATA TYPE DECIMAL(65,30),
ALTER COLUMN "protein" SET DATA TYPE DECIMAL(65,30),
ALTER COLUMN "fat" SET DATA TYPE DECIMAL(65,30),
ALTER COLUMN "carbohydrate" SET DATA TYPE DECIMAL(65,30),
ALTER COLUMN "fiber" SET DATA TYPE DECIMAL(65,30),
ALTER COLUMN "natrium" SET DATA TYPE DECIMAL(65,30),
ALTER COLUMN "cholesterol" SET DATA TYPE DECIMAL(65,30),
ALTER COLUMN "sfa" SET DATA TYPE DECIMAL(65,30),
ALTER COLUMN "mufa" SET DATA TYPE DECIMAL(65,30),
ALTER COLUMN "pufa" SET DATA TYPE DECIMAL(65,30);

-- AlterTable
ALTER TABLE "Nutrition" ALTER COLUMN "calory" SET DEFAULT 0.0,
ALTER COLUMN "calory" SET DATA TYPE DECIMAL(6,1);

-- AlterTable
ALTER TABLE "NutritionSummary" ALTER COLUMN "calory" SET DEFAULT 0.0,
ALTER COLUMN "calory" SET DATA TYPE DECIMAL(6,1);
