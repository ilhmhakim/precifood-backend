import { prismaClient } from '../application/database';
import { ResponseError } from '../error/response-error';
import {
    GenerateRecommendationRequest,
    GetRecommendationListDetailRequest,
    GetRecommendationRequest,
} from '../model/recommendation-model';
import { MenuService } from '../service/menu-service';
import { RecommendationService } from '../service/recommendation-service';
import { UserRequest } from '../type/user';
import { Response, NextFunction } from 'express';

export class RecommendationController {
    static async getRecommendationFromModel(
        req: UserRequest,
        res: Response,
        next: NextFunction
    ) {
        const isGenerating = await RecommendationService.checkGenerateStatus(
            req.user.id
        );

        if (isGenerating?.is_generating === true) {
            return next(
                new ResponseError(
                    400,
                    'Generate rekomendasi sedang dalam proses'
                )
            );
        }

        try {
            const request: GenerateRecommendationRequest = {
                token: req.headers['authorization'] as string,
                consumer_id: String(req.user.id),
                restaurant_id: req.params.restaurantId,
            };

            res.status(200).json({
                message:
                    'Generate rekomendasi berhasil! Silahkan untuk merefresh halaman rekomendasi menu setelah 5 menit',
            });

            setImmediate(async () => {
                try {
                    await RecommendationService.getRecommendationFromModel(
                        request
                    );
                } catch (error) {
                    console.error(
                        'Error in RecommendationService.getRecommendation:',
                        error
                    );
                }
            });
        } catch (e) {
            await prismaClient.consumer.update({
                where: { consumer_id: String(req.user.id) },
                data: {
                    generator_error: String(e),
                    is_generating: false,
                },
            });
        }
    }

    static async getRecommendation(
        req: UserRequest,
        res: Response,
        next: NextFunction
    ) {
        try {
            const request: GetRecommendationRequest = {
                consumer_id: req.user.id,
                restaurant_id: req.params.restaurantId,
            };

            const response =
                await RecommendationService.getRecommendation(request);

            res.status(200).json({
                message: 'Success!',
                data: response,
            });
        } catch (e) {
            next(e);
        }
    }

    static async getRecommendationDetail(
        req: UserRequest,
        res: Response,
        next: NextFunction
    ) {
        try {
            const request: GetRecommendationListDetailRequest = {
                restaurant_id: String(req.params.restaurantId),
                consumer_id: String(req.user.id),
                recommendation_id: Number(req.params.recommendationId),
            };

            const response =
                await RecommendationService.getRecommendationListDetail(
                    request
                );

            res.status(200).json({
                message: 'Success!',
                data: response,
            });
        } catch (e) {
            next(e);
        }
    }
}
