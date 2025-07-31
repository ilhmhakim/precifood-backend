import React, { Dispatch, SetStateAction } from "react";
import Carousel from "react-material-ui-carousel";

import Image from "next/image";

import {
  DialogContent,
  Typography,
} from "@mui/material";

import InfoSuccessOrderDialog from "@/components/order/InfoSuccessOrderDialog";
import { NutritionSummary, Recommendation } from "@/interfaces/menu";

export default function RecommendationDialogContent({
  recommendation,
  rank,
  id,
  nutrition_summary,
  setOpen,
}: {
  recommendation: Recommendation;
  rank: number;
  id: number;
  nutrition_summary: NutritionSummary;
  setOpen: Dispatch<SetStateAction<boolean>>
}) {
  return (
    (<DialogContent className="space-y-6">
      <Carousel
        indicators={false}
        navButtonsAlwaysVisible
        className="flex justify-center"
      >
        {recommendation.recommendations.map((rec) => (
          <div key={rec.id} className="flex flex-col items-center">
            <Image
              src={rec.image_url}
              alt={`Foto ${rec.name}`}
              width={200}
              height={200}
              className="rounded-lg shadow-md"
              style={{
                maxWidth: "100%",
                height: "auto"
              }} />
            <Typography
              variant="subtitle1"
              component="div"
              className="text-lg font-medium text-gray-700 mt-2"
            >
              {rec.name}
            </Typography>
          </div>
        ))}
      </Carousel>
      <div className="space-y-4">
        <Typography
          variant="subtitle2"
          className="text-sm text-gray-600 text-center"
        >
          Porsi Menu Rekomendasi untuk 1 Orang (Konsumer Pemilik Akun) sesuai
          dengan Kebutuhan Gizi
        </Typography>
        <Typography
          variant="subtitle2"
          className="text-sm text-gray-600 font-medium"
        >
          Nutrisi Menu Rekomendasi {rank}:
          <div className="space-y-1 text-sm italic text-gray-500">
            <p>Kalori: {nutrition_summary.calory} kcal</p>
            <p>Protein: {nutrition_summary.protein} gram</p>
            <p>Lemak: {nutrition_summary.fat} gram</p>
            <p>Karbohidrat: {nutrition_summary.carbohydrate} gram</p>
          </div>
        </Typography>
      </div>
      <Typography
        variant="subtitle1"
        className="text-lg font-semibold text-gray-800 mt-4"
      >
        Detail Menu Rekomendasi {rank}
      </Typography>
      <div className="space-y-4">
        {recommendation.recommendations.map((rec) => (
          <div key={rec.id} className="p-4 bg-gray-50 rounded-lg shadow">
            <Typography
              variant="subtitle1"
              component="div"
              className="flex justify-between items-center text-lg font-semibold text-gray-700"
            >
              <span>{rec.name}</span>
              <span>Rp{rec.price.toLocaleString("id-ID")}</span>
            </Typography>
            <Typography
              variant="body2"
              className="text-sm text-gray-600 mt-1"
            >
              {rec.description}
            </Typography>
            <div className="text-sm italic text-gray-500 mt-2">
              <p>Porsi hidangan untuk: {rec.portion} orang</p>
              <p>Kategori: {rec.category}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-between items-center mt-6 border-t pt-4">
        <Typography
          variant="body1"
          className="text-lg font-semibold text-gray-800"
        >
          Total Harga: Rp
          {recommendation.total_price.toLocaleString("id-ID")}
        </Typography>
        <InfoSuccessOrderDialog
          id={id}
          closeRecommendationDialog={() => setOpen(false)}
        />
      </div>
    </DialogContent>)
  );
}
