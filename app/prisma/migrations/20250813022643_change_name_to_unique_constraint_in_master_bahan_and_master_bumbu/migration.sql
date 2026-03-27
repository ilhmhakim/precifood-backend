/*
  Warnings:

  - You are about to alter the column `name` on the `MasterBahan` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `name` on the `MasterBumbu` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - A unique constraint covering the columns `[name]` on the table `MasterBahan` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `MasterBumbu` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "MasterBahan" ALTER COLUMN "name" SET DATA TYPE VARCHAR(255);

-- AlterTable
ALTER TABLE "MasterBumbu" ALTER COLUMN "name" SET DATA TYPE VARCHAR(255);

-- CreateIndex
CREATE UNIQUE INDEX "MasterBahan_name_key" ON "MasterBahan"("name");

-- CreateIndex
CREATE UNIQUE INDEX "MasterBumbu_name_key" ON "MasterBumbu"("name");
