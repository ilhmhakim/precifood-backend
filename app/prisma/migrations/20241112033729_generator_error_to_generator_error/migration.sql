/*
  Warnings:

  - You are about to drop the column `generatorError` on the `Consumer` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Consumer" DROP COLUMN "generatorError",
ADD COLUMN     "generator_error" TEXT;
