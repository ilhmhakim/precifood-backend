import RecommendationCard from "@/components/recommendation/RecommendationCard";
import { SimpleRecommendation } from "@/interfaces/menu";

export default function RecommendationList({
  recommendationlist,
}: {
  recommendationlist: SimpleRecommendation[];
}) {
  return (
    <div className="space-y-2">
      {recommendationlist.map((recommendation) => (
        <RecommendationCard
          recommendation={recommendation}
          key={recommendation.id}
        />
      ))}
    </div>
  );
}
