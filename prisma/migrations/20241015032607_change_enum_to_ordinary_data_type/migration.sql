/*
  Warnings:

  - Changed the type of `category` on the `Menu` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `status` on the `Menu` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Menu" DROP COLUMN "category",
ADD COLUMN     "category" VARCHAR(50) NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" VARCHAR(50) NOT NULL;
