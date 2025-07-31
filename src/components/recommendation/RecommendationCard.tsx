import Carousel from "react-material-ui-carousel";

import Image from "next/image";

import { Card, CardActions, CardContent } from "@mui/material";

import InfoRecommendationDialog from "@/components/recommendation/InfoRecommendationDialog";
import { SimpleRecommendation } from "@/interfaces/menu";
import { truncateText } from "@/utils/string";

export default function RecommendationCard({
  recommendation,
}: {
  recommendation: SimpleRecommendation;
}) {
  return (
    (<Card className="flex items-center p-4 rounded-3xl">
      <div className="w-24 h-24 relative rounded-3xl overflow-hidden">
        <Carousel indicators={false} navButtonsAlwaysInvisible>
          {recommendation.image_url.map((imageObj, index) => (
            <div key={index} className="relative w-full h-full">
              <Image
                src={imageObj.url}
                alt={`Foto ${recommendation.rank} ${index + 1}`}
                width={100}
                height={100}
                style={{
                  maxWidth: "100%",
                  height: "auto"
                }} />
            </div>
          ))}
        </Carousel>
      </div>
      <div className="flex-1 flex flex-col justify-between">
        <CardContent className="flex-1 px-4">
          <div className="font-bold text-lg">
            {`Menu Rekomendasi ${recommendation.rank}`}
          </div>
          <div className="text-sm">
            {truncateText(recommendation.description, 50)}
          </div>
          <div className="text-base font-medium">
            Rp{recommendation.total_price.toLocaleString("id-ID")}
          </div>
        </CardContent>
        <CardActions className="justify-end p-0">
          <InfoRecommendationDialog
            id={recommendation.id}
            rank={recommendation.rank}
          />
        </CardActions>
      </div>
    </Card>)
  );
}
