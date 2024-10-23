import { prismaClient } from "../application/database";
import { GetRecommendationRequest, RecommendationDetail, RecommendationResponse } from "../model/recommendation-model";
import { ResponseError } from "../error/response-error";
import { MenuService } from "./menu-service";

export class RecommendationService {
    static async getRecommendationList(request) {
        const requestRecommendationList
    }

    static async getRecommendation(request: GetRecommendationRequest): Promise<RecommendationResponse> {
        const payload = {
            consumerId: request.consumer_id,
            restaurantId: request.restaurant_id,
        };

        const response = await fetch('http://127.0.0.1:5000/get_menu', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            throw new ResponseError(response.status, 'Failed to fetch recommendation from Python backend.');
        }

        const data = await response.json();

        // Simpan rekomendasi ke database
        await this.createRecommendations(data, request.restaurant_id, request.consumer_id);

        // Kembalikan data rekomendasi pertama
        return data[0];
    }

    static async createRecommendations(recommendations: any, restaurantId: string, consumerId: string) {
        // Verifikasi apakah restoran ada atau tidak
        const restaurant = await MenuService.checkRestaurantExist(restaurantId);

        // Buat dan simpan rekomendasi utama
        const recommendation = await prismaClient.recommendation.create({
            data: {
                consumer_id: consumerId,
                restaurant_id: restaurantId,
                restaurant_name: restaurant.contact.name
            }
        });

        // Simpan semua rekomendasi
        for (let i = 0; i < recommendations.length; i++) {
            await this.createRecommendationOne(recommendations[i], restaurantId, recommendation.id);
        }

        return { message: 'Recommendation saved successfully!' };
    }

    static async createRecommendationOne(recommendationDetail: RecommendationDetail, restaurantId: string, recommendationId: number) {
        // Ambil detail menu dari database berdasarkan ID yang diterima
        const menuOne = await MenuService.checkMenuExist(recommendationDetail.makanan_pokok, restaurantId);
        const menuTwo = await MenuService.checkMenuExist(recommendationDetail.lauk_pauk, restaurantId);
        const menuThree = await MenuService.checkMenuExist(recommendationDetail.sayuran, restaurantId);
        const menuFour = await MenuService.checkMenuExist(recommendationDetail.minuman, restaurantId);

        // Jika salah satu menu tidak ditemukan, lemparkan error
        if (!menuOne || !menuTwo || !menuThree || !menuFour) {
            throw new ResponseError(404, 'One or more menu items not found.');
        }

        // Buat catatan rekomendasi di database
        await prismaClient.recommendationList.create({
            data: {
                recommendation_id: recommendationId,
                description: `${menuOne.menu.name}, ${menuTwo.menu.name}, ${menuThree.menu.name}, ${menuFour.menu.name}`,
                total_price: menuOne.menu.price + menuTwo.menu.price + menuThree.menu.price + menuFour.menu.price,
                RecommendationListDetail: {
                    createMany: {
                        data: [
                            {
                                menu_id: menuOne.menu.id,
                                menu_name: menuOne.menu.name,
                                menu_category: menuOne.menu.category,
                                menu_price: menuOne.menu.price,
                                image_url: menuOne.menu.image_url
                            },
                            {
                                menu_id: menuTwo.menu.id,
                                menu_name: menuTwo.menu.name,
                                menu_category: menuTwo.menu.category,
                                menu_price: menuTwo.menu.price,
                                image_url: menuTwo.menu.image_url
                            },
                            {
                                menu_id: menuThree.menu.id,
                                menu_name: menuThree.menu.name,
                                menu_category: menuThree.menu.category,
                                menu_price: menuThree.menu.price,
                                image_url: menuThree.menu.image_url
                            },
                            {
                                menu_id: menuFour.menu.id,
                                menu_name: menuFour.menu.name,
                                menu_category: menuFour.menu.category,
                                menu_price: menuFour.menu.price,
                                image_url: menuFour.menu.image_url
                            }
                        ]
                    }
                }
            }
        });
    }
}
