import {UserRequest} from "../type/user";
import {Response, NextFunction} from "express";
import {GetRecommendationRequest} from "../model/recommendation-model";
import {MenuService} from "../service/menu-service";
import {RecommendationService} from "../service/recommendation-service";

export class RecommendationController {
    static async getRecommendations(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const request: GetRecommendationRequest = {
                consumer_id: req.user.id,
                restaurant_id: req.params.restaurantId
            }

            const response = await RecommendationService.getRecommendation(request);

            res.status(200).json({
                message: "Success!",
                data: response
            })

        } catch (e) {
            next(e);
        }
    }
}