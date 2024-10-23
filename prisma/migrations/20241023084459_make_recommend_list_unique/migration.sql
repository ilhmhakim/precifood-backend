/*
  Warnings:

  - A unique constraint covering the columns `[recommendation_id]` on the table `RecommendationList` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "RecommendationList_recommendation_id_key" ON "RecommendationList"("recommendation_id");
