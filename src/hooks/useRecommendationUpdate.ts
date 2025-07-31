import { useEffect, useState } from "react";

import { openToast } from "@/components/Toast";
import { IndexRecommendation } from "@/interfaces/menu";
import { getCookies, setCookie } from "@/utils/cookie";

function useRecommendationUpdate(recommendation: IndexRecommendation | null) {
  const [isRecommendationUpdated, setIsRecommendationUpdated] = useState(false);

  useEffect(() => {
    if (!recommendation) return;

    const lastRecommendedAt = getCookies("last_recommended_at");
    const currentRecommendedAt = String(recommendation.recommended_at);

    if (!lastRecommendedAt) {
      setCookie("last_recommended_at", currentRecommendedAt);
      return;
    }

    if (currentRecommendedAt !== lastRecommendedAt) {
      setIsRecommendationUpdated(true);
      setCookie("last_recommended_at", currentRecommendedAt);
      openToast({ type: "success", message: "Rekomendasi telah diperbarui" });
    }
  }, [recommendation]);

  return isRecommendationUpdated;
}

export default useRecommendationUpdate;
