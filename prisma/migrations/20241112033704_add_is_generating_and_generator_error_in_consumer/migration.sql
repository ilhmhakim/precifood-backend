-- AlterTable
ALTER TABLE "Consumer" ADD COLUMN     "generatorError" TEXT,
ADD COLUMN     "isGenerating" BOOLEAN NOT NULL DEFAULT false;
