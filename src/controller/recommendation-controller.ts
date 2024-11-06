import {UserRequest} from "../type/user";
import {Response, NextFunction} from "express";
import {GetRecommendationListDetailRequest, GetRecommendationRequest} from "../model/recommendation-model";
import {MenuService} from "../service/menu-service";
import {RecommendationService} from "../service/recommendation-service";

export class RecommendationController {
    static async getRecommendationFromModel(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const request: GetRecommendationRequest = {
                consumer_id: req.user.id,
                restaurant_id: req.params.restaurantId
            }

            res.status(200).json({
                message: "Generate rekomendasi berhasil! Silahkan untuk merefresh halaman rekomendasi menu setelah 5 menit",
            });

            setImmediate(async () => {
                try {
                    await RecommendationService.getRecommendationFromModel(request);
                } catch (error) {
                    console.error("Error in RecommendationService.getRecommendation:", error);
                }
            });
        } catch (e) {
            next(e);
        }
    }

    static async getRecommendation(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const request: GetRecommendationRequest = {
                consumer_id: req.user.id,
                restaurant_id: req.params.restaurantId
            }

            const response = await RecommendationService.getRecommendation(request);

            res.status(200).json({
                message: "Success!",
                data: response
            });
        } catch (e) {
            next(e);
        }
    }

    static async getRecommendationDetail(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const request: GetRecommendationListDetailRequest = {
                restaurant_id: String(req.params.restaurantId),
                consumer_id: String(req.user.id),
                recommendation_id: Number(req.params.recommendationId)
            }

            const response = await RecommendationService.getRecommendationListDetail(request);

            res.status(200).json({
                message: "Success!",
                data: response
            });

        } catch (e) {
            next(e);
        }
    }
}