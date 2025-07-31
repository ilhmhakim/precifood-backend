import { openToast } from "../Toast";

import { Button } from "@mui/material";

import { postDataAuthenticated } from "@/utils/http";
import { getCookies } from "@/utils/cookie";

export function GenerateRecommendationButton() {
  const generateRecommendation = async () => {
    try {
      await postDataAuthenticated(
        `/restaurants/${getCookies("restaurant_id")}/recommendations`,
      );
      openToast({
        type: "success",
        message:
          "Generate rekomendasi berhasil! Silahkan untuk merefresh halaman rekomendasi menu setelah 5 menit",
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error.message);
        openToast({ type: "error", message: error.message });
      }
    }
  };
  return (
    <Button
      className="rounded-3xl"
      size="small"
      variant="contained"
      onClick={generateRecommendation}
    >
      Rekomendasi Baru
    </Button>
  );
}
