import { prismaClient } from "../application/database";
import {
    GetRecommendationListDetailRequest,
    GetRecommendationRequest,
    RecommendationDetail, RecommendationDetailResponse,
    toGetRecommendation, toGetRecommendationDetail
} from "../model/recommendation-model";
import { ResponseError } from "../error/response-error";
import { MenuService } from "./menu-service";
import {Validation} from "../validation/validation";
import {RecommendationValidation} from "../validation/recommendation-validation";

export class RecommendationService {
    static async getRecommendation(request: GetRecommendationRequest) {
        const requestRecommendation = Validation.validate(RecommendationValidation.GETRECOMMENDATION, request);

        // Mencari rekomendasi berdasarkan restaurant_id dan consumer_id
        const recommendation = await prismaClient.recommendation.findFirst({
            where: {
                restaurant_id: requestRecommendation.restaurant_id,
                consumer_id: requestRecommendation.consumer_id,
            },
            orderBy: {
                recommended_at: "desc"
            }
        });

        if (!recommendation) {
            throw new ResponseError(404, "Tidak ditemukan rekomendasi, silahkan generate rekomendasi baru");
        }

        // Mengambil RecommendationList dan meng-include RecommendationListDetail di dalamnya
        const recommendationLists = await prismaClient.recommendationList.findMany({
            where: {
                recommendation_id: recommendation.id
            },
            include: {
                RecommendationListDetail: true // Meng-include RecommendationListDetail untuk akses langsung
            },
            orderBy: {
                rank: 'asc'
            }
        });

        // Menggunakan toGetRecommendation untuk mengembalikan hasil
        return toGetRecommendation(recommendation, recommendationLists);
    }

    // Fungsi utama untuk mendapatkan rekomendasi detail
    static async getRecommendationListDetail(request: GetRecommendationListDetailRequest): Promise<RecommendationDetailResponse> {
        // Mendapatkan semua detail rekomendasi berdasarkan ID rekomendasi
        const recommendationListDetails = await prismaClient.recommendationListDetail.findMany({
            where: {
                recommendation_list_id: request.recommendation_id
            },
            include: {
                recommendation_list: true
            }
        });

        if (recommendationListDetails.length === 0) {
            throw new Error("Recommendation list not found");
        }

        // Ambil recommendation_list untuk mengambil total_price
        const recommendationList = recommendationListDetails[0].recommendation_list;

        // Mengembalikan response dalam bentuk yang diinginkan
        return toGetRecommendationDetail(recommendationList, recommendationListDetails);
    }


    static async getRecommendationFromModel(request: GetRecommendationRequest) {
       const recommendationRequest = Validation.validate(RecommendationValidation.GETRECOMMENDATION, request);

        const payload = {
            consumerId: recommendationRequest.consumer_id,
            restaurantId: recommendationRequest.restaurant_id,
        };

        const response = await fetch('https://precifood-model.et.r.appspot.com/get_menu', {
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

        const recommendation = await this.getRecommendation(recommendationRequest);

        return recommendation;
    }

    static async createRecommendations(recommendations: any, restaurantId: string, consumerId: string) {
        const restaurant = await MenuService.checkRestaurantExist(restaurantId);

        const recommendation = await prismaClient.recommendation.create({
            data: {
                consumer_id: consumerId,
                restaurant_id: restaurantId,
                restaurant_name: restaurant.contact.name
            },
            include: {
                RecommendationList: true
            }
        });

        // Simpan semua rekomendasi
        for (let i = 0; i < recommendations.length; i++) {
            await this.createRecommendation(recommendations[i], restaurantId, recommendation.id, i);
        }
    }

    static async createRecommendation(recommendationDetail: RecommendationDetail, restaurantId: string, recommendationId: number, i: number) {
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
                rank: i + 1,
                description: `${menuOne.menu.name}, ${menuTwo.menu.name}, ${menuThree.menu.name}, ${menuFour.menu.name}`,
                total_price: menuOne.menu.price + menuTwo.menu.price + menuThree.menu.price + menuFour.menu.price,
                RecommendationListDetail: {
                    createMany: {
                        data: [
                            {
                                menu_id: menuOne.menu.id,
                                menu_name: menuOne.menu.name,
                                menu_category: menuOne.menu.category,
                                menu_portion: menuOne.menu.portion,
                                menu_price: menuOne.menu.price,
                                menu_description: menuOne.menu.description,
                                image_url: menuOne.menu.image_url
                            },
                            {
                                menu_id: menuTwo.menu.id,
                                menu_name: menuTwo.menu.name,
                                menu_category: menuTwo.menu.category,
                                menu_portion: menuTwo.menu.portion,
                                menu_price: menuTwo.menu.price,
                                menu_description: menuTwo.menu.description,
                                image_url: menuTwo.menu.image_url
                            },
                            {
                                menu_id: menuThree.menu.id,
                                menu_name: menuThree.menu.name,
                                menu_category: menuThree.menu.category,
                                menu_portion: menuThree.menu.portion,
                                menu_price: menuThree.menu.price,
                                menu_description: menuThree.menu.description,
                                image_url: menuThree.menu.image_url
                            },
                            {
                                menu_id: menuFour.menu.id,
                                menu_name: menuFour.menu.name,
                                menu_category: menuFour.menu.category,
                                menu_portion: menuFour.menu.portion,
                                menu_price: menuFour.menu.price,
                                menu_description: menuFour.menu.description,
                                image_url: menuFour.menu.image_url
                            }
                        ]
                    }
                }
            }
        });
    }
}
