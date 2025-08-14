/*
  Warnings:

  - You are about to alter the column `natrium` on the `MasterBahan` table. The data in that column could be lost. The data in that column will be cast from `Decimal(6,1)` to `Decimal(6,2)`.
  - You are about to alter the column `cholesterol` on the `MasterBahan` table. The data in that column could be lost. The data in that column will be cast from `Decimal(6,1)` to `Decimal(6,2)`.
  - You are about to alter the column `natrium` on the `MasterBumbu` table. The data in that column could be lost. The data in that column will be cast from `Decimal(6,1)` to `Decimal(6,2)`.
  - You are about to alter the column `cholesterol` on the `MasterBumbu` table. The data in that column could be lost. The data in that column will be cast from `Decimal(6,1)` to `Decimal(6,2)`.

*/
-- AlterTable
ALTER TABLE "MasterBahan" ALTER COLUMN "natrium" SET DATA TYPE DECIMAL(6,2),
ALTER COLUMN "cholesterol" SET DATA TYPE DECIMAL(6,2);

-- AlterTable
ALTER TABLE "MasterBumbu" ALTER COLUMN "natrium" SET DATA TYPE DECIMAL(6,2),
ALTER COLUMN "cholesterol" SET DATA TYPE DECIMAL(6,2);
