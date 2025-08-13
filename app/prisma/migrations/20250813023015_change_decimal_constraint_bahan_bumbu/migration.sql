/*
  Warnings:

  - You are about to alter the column `protein` on the `MasterBahan` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(6,1)`.
  - You are about to alter the column `fat` on the `MasterBahan` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(6,1)`.
  - You are about to alter the column `carbohydrate` on the `MasterBahan` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(6,1)`.
  - You are about to alter the column `fiber` on the `MasterBahan` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(6,1)`.
  - You are about to alter the column `natrium` on the `MasterBahan` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(6,1)`.
  - You are about to alter the column `cholesterol` on the `MasterBahan` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(6,1)`.
  - You are about to alter the column `sfa` on the `MasterBahan` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(6,1)`.
  - You are about to alter the column `mufa` on the `MasterBahan` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(6,1)`.
  - You are about to alter the column `pufa` on the `MasterBahan` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(6,1)`.
  - You are about to alter the column `protein` on the `MasterBumbu` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(6,1)`.
  - You are about to alter the column `fat` on the `MasterBumbu` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(6,1)`.
  - You are about to alter the column `carbohydrate` on the `MasterBumbu` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(6,1)`.
  - You are about to alter the column `fiber` on the `MasterBumbu` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(6,1)`.
  - You are about to alter the column `natrium` on the `MasterBumbu` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(6,1)`.
  - You are about to alter the column `cholesterol` on the `MasterBumbu` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(6,1)`.
  - You are about to alter the column `sfa` on the `MasterBumbu` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(6,1)`.
  - You are about to alter the column `mufa` on the `MasterBumbu` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(6,1)`.
  - You are about to alter the column `pufa` on the `MasterBumbu` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(6,1)`.

*/
-- AlterTable
ALTER TABLE "MasterBahan" ALTER COLUMN "protein" SET DEFAULT 0.0,
ALTER COLUMN "protein" SET DATA TYPE DECIMAL(6,1),
ALTER COLUMN "fat" SET DEFAULT 0.0,
ALTER COLUMN "fat" SET DATA TYPE DECIMAL(6,1),
ALTER COLUMN "carbohydrate" SET DEFAULT 0.0,
ALTER COLUMN "carbohydrate" SET DATA TYPE DECIMAL(6,1),
ALTER COLUMN "fiber" SET DEFAULT 0.0,
ALTER COLUMN "fiber" SET DATA TYPE DECIMAL(6,1),
ALTER COLUMN "natrium" SET DEFAULT 0.0,
ALTER COLUMN "natrium" SET DATA TYPE DECIMAL(6,1),
ALTER COLUMN "cholesterol" SET DEFAULT 0.0,
ALTER COLUMN "cholesterol" SET DATA TYPE DECIMAL(6,1),
ALTER COLUMN "sfa" SET DEFAULT 0.0,
ALTER COLUMN "sfa" SET DATA TYPE DECIMAL(6,1),
ALTER COLUMN "mufa" SET DEFAULT 0.0,
ALTER COLUMN "mufa" SET DATA TYPE DECIMAL(6,1),
ALTER COLUMN "pufa" SET DEFAULT 0.0,
ALTER COLUMN "pufa" SET DATA TYPE DECIMAL(6,1);

-- AlterTable
ALTER TABLE "MasterBumbu" ALTER COLUMN "protein" SET DEFAULT 0.0,
ALTER COLUMN "protein" SET DATA TYPE DECIMAL(6,1),
ALTER COLUMN "fat" SET DEFAULT 0.0,
ALTER COLUMN "fat" SET DATA TYPE DECIMAL(6,1),
ALTER COLUMN "carbohydrate" SET DEFAULT 0.0,
ALTER COLUMN "carbohydrate" SET DATA TYPE DECIMAL(6,1),
ALTER COLUMN "fiber" SET DEFAULT 0.0,
ALTER COLUMN "fiber" SET DATA TYPE DECIMAL(6,1),
ALTER COLUMN "natrium" SET DEFAULT 0.0,
ALTER COLUMN "natrium" SET DATA TYPE DECIMAL(6,1),
ALTER COLUMN "cholesterol" SET DEFAULT 0.0,
ALTER COLUMN "cholesterol" SET DATA TYPE DECIMAL(6,1),
ALTER COLUMN "sfa" SET DEFAULT 0.0,
ALTER COLUMN "sfa" SET DATA TYPE DECIMAL(6,1),
ALTER COLUMN "mufa" SET DEFAULT 0.0,
ALTER COLUMN "mufa" SET DATA TYPE DECIMAL(6,1),
ALTER COLUMN "pufa" SET DEFAULT 0.0,
ALTER COLUMN "pufa" SET DATA TYPE DECIMAL(6,1);
