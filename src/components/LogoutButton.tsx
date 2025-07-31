import { useRouter } from "next/router";

import { openConfirmationDialog } from "./ConfirmationDialog";

import Button from "@mui/material/Button";

import { removeCookiesLogout } from "@/utils/cookie";

export function LogoutButton() {
  const router = useRouter();

  const logout = async () => {
    const confirmation = await openConfirmationDialog({
      title: "Konfirmasi Keluar Akun",
      description: "Apakah Anda yakin ingin keluar dari aplikasi?",
    });
    if (!confirmation) return;
    removeCookiesLogout();
    router.push("/login");
  };
  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto space-y-4 mt-6">
      <Button
        variant="contained"
        onClick={logout}
        className="w-full border-2 border-error bg-error/10 text-error rounded-full py-3 font-semibold hover:bg-error/50 hover:text-white"
      >
        Keluar
      </Button>
    </div>
  );
}
