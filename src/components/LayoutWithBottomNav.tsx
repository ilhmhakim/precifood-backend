import BottomNav from "@/components/BottomNav";
import { Toast } from "@/components/Toast";
import { ConfirmationDialog } from "./ConfirmationDialog";

export default function LayoutWithBottomNav({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="p-8 pb-24 space-y-5">{children}</div>
      <ConfirmationDialog />
      <Toast />
      <BottomNav />
    </div>
  );
}
