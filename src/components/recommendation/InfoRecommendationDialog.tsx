import { useCallback, useRef, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";


import { Button, Dialog, DialogTitle, IconButton, Typography } from "@mui/material";

import RecommendationDialogContent from "@/components/recommendation/RecommendationDialogContent";
import { Recommendation } from "@/interfaces/menu";
import { getDataAuthenticated } from "@/utils/http";
import { getCookies } from "@/utils/cookie";

export default function InfoRecommendationDialog({
  id,
  rank,
}: {
  id: number;
  rank: number;
}) {
  const [open, setOpen] = useState(false);
  const [recommendation, setRecommendation] = useState<Recommendation | null>(
    null,
  );
  const recommendationFetched = useRef(false);

  const fetchData = useCallback(async () => {
    try {
      if (recommendationFetched.current) return;
      const data = await getDataAuthenticated(
        `/restaurants/${getCookies("restaurant_id")}/recommendations/${id}`,
      );
      setRecommendation(data);
      recommendationFetched.current = true;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error.message);
      }
    }
  }, [id]);

  const openInfoRecommendationDialog = () => {
    setOpen(true);
    fetchData();
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button
        className="rounded-3xl"
        size="small"
        variant="contained"
        onClick={openInfoRecommendationDialog}
      >
        Lihat
      </Button>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle className="relative py-4 px-6">
        <Typography
          variant="h6"
          className="text-xl text-center font-semibold text-gray-800"
        >
          {`Menu Rekomendasi ${rank}`}
        </Typography>
        <IconButton
          aria-label="close"
          onClick={() => setOpen(false)}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
        {recommendation ? (
          <RecommendationDialogContent
            recommendation={recommendation}
            rank={rank}
            id={id}
            nutrition_summary={recommendation.nutrition_summary}
            setOpen={setOpen}
          />
        ) : null}
      </Dialog>
    </div>
  );
}
