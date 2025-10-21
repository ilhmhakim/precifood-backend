-- DropForeignKey
ALTER TABLE "MenuApprovalLog" DROP CONSTRAINT "MenuApprovalLog_menu_id_fkey";

-- AddForeignKey
ALTER TABLE "MenuApprovalLog" ADD CONSTRAINT "MenuApprovalLog_menu_id_fkey" FOREIGN KEY ("menu_id") REFERENCES "Menu"("id") ON DELETE CASCADE ON UPDATE CASCADE;
