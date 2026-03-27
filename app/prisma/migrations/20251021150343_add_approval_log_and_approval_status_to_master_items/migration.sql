-- CreateEnum
CREATE TYPE "MasterItemStatus" AS ENUM ('Approved', 'Waiting', 'Rejected');

-- AlterTable
ALTER TABLE "MasterBahan" ADD COLUMN     "status" "MasterItemStatus" NOT NULL DEFAULT 'Waiting';

-- AlterTable
ALTER TABLE "MasterBumbu" ADD COLUMN     "status" "MasterItemStatus" NOT NULL DEFAULT 'Waiting';

-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "bahan_id" INTEGER,
ADD COLUMN     "bahan_name" VARCHAR(255),
ADD COLUMN     "bumbu_id" INTEGER,
ADD COLUMN     "bumbu_name" VARCHAR(255),
ALTER COLUMN "menu_id" DROP NOT NULL,
ALTER COLUMN "menu_name" DROP NOT NULL;

-- CreateTable
CREATE TABLE "MasterBahanApprovalLog" (
    "id" SERIAL NOT NULL,
    "bahan_id" INTEGER NOT NULL,
    "from_status" "MasterItemStatus",
    "to_status" "MasterItemStatus" NOT NULL,
    "changed_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reason" TEXT,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MasterBahanApprovalLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MasterBumbuApprovalLog" (
    "id" SERIAL NOT NULL,
    "bumbu_id" INTEGER NOT NULL,
    "from_status" "MasterItemStatus",
    "to_status" "MasterItemStatus" NOT NULL,
    "changed_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reason" TEXT,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MasterBumbuApprovalLog_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MasterBahanApprovalLog" ADD CONSTRAINT "MasterBahanApprovalLog_bahan_id_fkey" FOREIGN KEY ("bahan_id") REFERENCES "MasterBahan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MasterBumbuApprovalLog" ADD CONSTRAINT "MasterBumbuApprovalLog_bumbu_id_fkey" FOREIGN KEY ("bumbu_id") REFERENCES "MasterBumbu"("id") ON DELETE CASCADE ON UPDATE CASCADE;
