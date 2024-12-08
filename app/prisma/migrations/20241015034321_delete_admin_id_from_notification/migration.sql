/*
  Warnings:

  - You are about to drop the column `admin_id` on the `Notification` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_admin_id_fkey";

-- AlterTable
ALTER TABLE "Notification" DROP COLUMN "admin_id";
