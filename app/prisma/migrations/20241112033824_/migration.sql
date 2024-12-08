/*
  Warnings:

  - You are about to drop the column `isGenerating` on the `Consumer` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Consumer" DROP COLUMN "isGenerating",
ADD COLUMN     "is_generating" BOOLEAN NOT NULL DEFAULT false;
