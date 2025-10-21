-- CreateTable
CREATE TABLE "MenuApprovalLog" (
    "id" SERIAL NOT NULL,
    "menu_id" INTEGER NOT NULL,
    "from_status" "MenuStatus",
    "to_status" "MenuStatus" NOT NULL,
    "changed_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reason" TEXT,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MenuApprovalLog_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MenuApprovalLog" ADD CONSTRAINT "MenuApprovalLog_menu_id_fkey" FOREIGN KEY ("menu_id") REFERENCES "Menu"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
