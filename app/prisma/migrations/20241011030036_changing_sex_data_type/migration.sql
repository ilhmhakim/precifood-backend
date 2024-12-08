/*
  Warnings:

  - Changed the type of `sex` on the `PersonalInformation` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "PersonalInformation" DROP COLUMN "sex",
ADD COLUMN     "sex" VARCHAR(10) NOT NULL;

-- DropEnum
DROP TYPE "ConsumerSex";
