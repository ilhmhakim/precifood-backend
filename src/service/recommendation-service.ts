import { prismaClient } from "../application/database";
import {
    GenerateRecommendationRequest,
    GetRecommendationListDetailRequest,
    GetRecommendationRequest,
    RecommendationDetail, RecommendationDetailResponse,
    toGetRecommendation, toGetRecommendationDetail
} from "../model/recommendation-model";
import { ResponseError } from "../error/response-error";
import { MenuService } from "./menu-service";
import {Validation} from "../validation/validation";
import {RecommendationValidation} from "../validation/recommendation-validation";
import {UserService} from "./user-service";

export class RecommendationService {

    static async checkGenerateStatus(consumerId: string) {
        const generateStatus = await prismaClient.consumer.findFirst({
            where:{
                consumer_id: consumerId,
            }
        });

        return generateStatus;
    }

    // Untuk menampilkan 10 set rekomendasi menu pada suatu restoran
    static async checkRecommendationForSpecificRestaurantandConsumer(restaurantId: string, consumerId: string) {
        const recommendation = await prismaClient.recommendation.findFirst({
            where: {
                restaurant_id: restaurantId,
                consumer_id: consumerId,
            },
            include: {
                RecommendationList: {
                    include: {
                        RecommendationListDetail: true
                    },
                    orderBy: {
                        rank: 'asc'
                    }
                }
            },
            orderBy: {
                recommended_at: "desc"
            }
        });

        if (!recommendation) {
            throw new ResponseError(404, "Tidak ditemukan rekomendasi, silahkan generate rekomendasi baru");
        }

        return recommendation;
    }

    static async checkRecommendationDetail(recommendationListId: number, consumerId: string) {
        // Cari recommendation list berdasarkan id dan cocokkan juga dengan consumer_id
        const recommendationList = await prismaClient.recommendationList.findFirst({
            where: {
                id: recommendationListId,
                recommendation: {
                    consumer_id: consumerId, // Pastikan hanya mengambil jika consumer_id cocok
                },
            },
            include: {
                recommendation: true,
                NutritionSummary: true,
                RecommendationListDetail: true,
            }
        });

        // Jika tidak ditemukan, lemparkan error karena bukan milik pengguna atau tidak ada
        if (!recommendationList) {
            throw new ResponseError(404, "Recommendation tidak ditemukan");
        }

        return recommendationList;
    }

    // Untuk menampilkan 10 set rekomendasi menu pada suatu restoran
    static async getRecommendation(request: GetRecommendationRequest) {
        const requestRecommendation = Validation.validate(RecommendationValidation.GETRECOMMENDATION, request);
        const recommendation = await this.checkRecommendationForSpecificRestaurantandConsumer(requestRecommendation.restaurant_id, requestRecommendation.consumer_id);
        return toGetRecommendation(recommendation, recommendation.RecommendationList!);
    }

    // Fungsi utama untuk mendapatkan rekomendasi detail
    static async getRecommendationListDetail(request: GetRecommendationListDetailRequest): Promise<RecommendationDetailResponse> {
        const requestRecommendation = Validation.validate(RecommendationValidation.GETRECOMMENDATION, request);
        // Menggunakan `checkRecommendationForSpecificRestaurantandConsumer` untuk mengambil semua data
        await this.checkRecommendationForSpecificRestaurantandConsumer(requestRecommendation.restaurant_id, requestRecommendation.consumer_id);

        // Gunakan fungsi checkRecommendationDetail untuk mendapatkan data recommendation list dan detailnya
        const recommendationList = await this.checkRecommendationDetail(requestRecommendation.recommendation_id, requestRecommendation.consumer_id);

        // Mengembalikan response dalam bentuk yang diinginkan
        return toGetRecommendationDetail(recommendationList, recommendationList.NutritionSummary!, recommendationList.RecommendationListDetail);
    }

    static async getRecommendationFromModel(request: GenerateRecommendationRequest) {
        const recommendationRequest = Validation.validate(RecommendationValidation.GENERATERECOMMENDATION, request);

        await UserService.checkRestaurant(recommendationRequest.restaurant_id);

        const payload = {
            restaurantId: recommendationRequest.restaurant_id,
        };

        // Update is_generating menjadi true
        await prismaClient.consumer.update({
            where: { consumer_id: recommendationRequest.consumer_id },
            data: { is_generating: true }
        });

        try {
            const response = await fetch('http://127.0.0.1:5000/generate-recommendation', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': recommendationRequest.token,
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                // Buat error dan throw untuk ditangani di level catch
                const error = new Error('Terjadi kegagalan pada generate model. Silahkan generate ulang!');
                error.name = 'ModelGenerationError';

                // Update status error di database sebelum throw error
                await prismaClient.consumer.update({
                    where: { consumer_id: recommendationRequest.consumer_id },
                    data: {
                        generator_error: String(error), // Menyimpan pesan error
                        is_generating: false, // Mengatur status is_generating menjadi false
                    }
                });

                // Hentikan eksekusi lebih lanjut dengan return
                return; // Menghentikan proses jika ada error
            }

            // Jika response berhasil, lanjutkan proses lainnya
            const data = await response.json();
            await this.createRecommendations(data, recommendationRequest.restaurant_id, recommendationRequest.consumer_id);

            // Update is_generating menjadi false setelah proses selesai
            await prismaClient.consumer.update({
                where: { consumer_id: recommendationRequest.consumer_id },
                data: { is_generating: false, generator_error: null }
            });

        } catch (error) {
            // Catat error jika terjadi kesalahan di level utama
            console.error("Error during recommendation generation:", error);

            // Update generator_error dengan pesan error
            await prismaClient.consumer.update({
                where: { consumer_id: recommendationRequest.consumer_id },
                data: {
                    generator_error: String(error),
                    is_generating: false,
                }
            });
        }
    }

    static async createRecommendations(recommendations: any, restaurantId: string, consumerId: string) {
        const restaurant = await MenuService.checkRestaurantExist(restaurantId);

        const recommendation = await prismaClient.recommendation.create({
            data: {
                consumer_id: consumerId,
                restaurant_id: restaurantId,
                restaurant_name: restaurant.Contact!.name
            },
            include: {
                RecommendationList: true
            }
        });

        // Simpan semua rekomendasi
        for (let i = 0; i < recommendations.length; i++) {
            try {
                await this.createRecommendation(recommendations[i], restaurantId, recommendation.id, i);
            } catch (error: unknown) {  // Menambahkan tipe `unknown`
                if (error instanceof Error) {  // Mengecek apakah error adalah instance dari Error
                    // Catat error untuk item tertentu, tetapi lanjutkan loop
                    console.error(`Error creating recommendation at rank ${i + 1}:`, error);

                    // Update generator_error untuk item yang gagal
                    await prismaClient.consumer.update({
                        where: { consumer_id: consumerId },
                        data: { generator_error: `Error pada rekomendasi rank ${i + 1}: ${error.message}` },
                    });
                } else {
                    // Tangani jika error bukan instance dari Error
                    console.error(`Unknown error creating recommendation at rank ${i + 1}:`, error);
                }
            }
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
                description: `${menuOne.name}, ${menuTwo.name}, ${menuThree.name}, ${menuFour.name}`,
                total_price: menuOne.price + menuTwo.price + menuThree.price + menuFour.price,
                NutritionSummary: {
                    create: {
                        calory: recommendationDetail.calory,
                        protein: recommendationDetail.protein,
                        fat: recommendationDetail.fat,
                        carbohydrate: recommendationDetail.carbohydrate
                    }
                },
                RecommendationListDetail: {
                    createMany: {
                        data: [
                            {
                                menu_id: menuOne.id,
                                menu_name: menuOne.name,
                                menu_category: menuOne.category,
                                menu_portion: menuOne.portion,
                                menu_price: menuOne.price,
                                menu_description: menuOne.description,
                                image_url: menuOne.image_url
                            },
                            {
                                menu_id: menuTwo.id,
                                menu_name: menuTwo.name,
                                menu_category: menuTwo.category,
                                menu_portion: menuTwo.portion,
                                menu_price: menuTwo.price,
                                menu_description: menuTwo.description,
                                image_url: menuTwo.image_url
                            },
                            {
                                menu_id: menuThree.id,
                                menu_name: menuThree.name,
                                menu_category: menuThree.category,
                                menu_portion: menuThree.portion,
                                menu_price: menuThree.price,
                                menu_description: menuThree.description,
                                image_url: menuThree.image_url
                            },
                            {
                                menu_id: menuFour.id,
                                menu_name: menuFour.name,
                                menu_category: menuFour.category,
                                menu_portion: menuFour.portion,
                                menu_price: menuFour.price,
                                menu_description: menuFour.description,
                                image_url: menuFour.image_url
                            }
                        ]
                    }
                }
            }
        });
    }

    // static async getRecommendationFromModel(request: GenerateRecommendationRequest) {
    //     const recommendationRequest = Validation.validate(RecommendationValidation.GENERATERECOMMENDATION, request);
    //
    //     await UserService.checkRestaurant(recommendationRequest.restaurant_id);
    //
    //     const payload = {
    //         restaurantId: recommendationRequest.restaurant_id,
    //     };
    //
    //     await prismaClient.consumer.update({
    //         where: {
    //             consumer_id: recommendationRequest.consumer_id
    //         },
    //         data: {
    //             is_generating: true
    //         }
    //     });
    //
    //     const response = await fetch('http://127.0.0.1:5000/generate-recommendation', {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json',
    //             'Authorization': `${recommendationRequest.token}`,
    //         },
    //         body: JSON.stringify(payload),
    //     });
    //
    //     if (!response.ok) {
    //         await prismaClient.consumer.update({
    //             where: {
    //                 consumer_id: recommendationRequest.consumer_id
    //             },
    //             data: {
    //                 generator_error: 'Terjadi kegagalan pada model.',
    //             }
    //         });
    //     }
    //
    //     const data = await response.json();
    //
    //     try {
    //         await this.createRecommendations(data, request.restaurant_id, request.consumer_id);
    //         await prismaClient.consumer.update({
    //             where: {
    //                 consumer_id: recommendationRequest.consumer_id
    //             },
    //             data: {
    //                 is_generating: false
    //             }
    //         });
    //     } catch (e) {
    //         await prismaClient.consumer.update({
    //             where: {
    //                 consumer_id: recommendationRequest.consumer_id
    //             },
    //             data: {
    //                 generator_error: '',
    //             }
    //         });
    //     }
    // }
    //
    // static async createRecommendations(recommendations: any, restaurantId: string, consumerId: string) {
    //     const restaurant = await MenuService.checkRestaurantExist(restaurantId);
    //
    //     const recommendation = await prismaClient.recommendation.create({
    //         data: {
    //             consumer_id: consumerId,
    //             restaurant_id: restaurantId,
    //             restaurant_name: restaurant.Contact!.name
    //         },
    //         include: {
    //             RecommendationList: true
    //         }
    //     });
    //
    //     // Simpan semua rekomendasi
    //     for (let i = 0; i < recommendations.length; i++) {
    //         await this.createRecommendation(recommendations[i], restaurantId, recommendation.id, i);
    //     }
    // }
    //
    // static async createRecommendation(recommendationDetail: RecommendationDetail, restaurantId: string, recommendationId: number, i: number) {
    //     // Ambil detail menu dari database berdasarkan ID yang diterima
    //     const menuOne = await MenuService.checkMenuExist(recommendationDetail.makanan_pokok, restaurantId);
    //     const menuTwo = await MenuService.checkMenuExist(recommendationDetail.lauk_pauk, restaurantId);
    //     const menuThree = await MenuService.checkMenuExist(recommendationDetail.sayuran, restaurantId);
    //     const menuFour = await MenuService.checkMenuExist(recommendationDetail.minuman, restaurantId);
    //
    //     // Jika salah satu menu tidak ditemukan, lemparkan error
    //     if (!menuOne || !menuTwo || !menuThree || !menuFour) {
    //         throw new ResponseError(404, 'One or more menu items not found.');
    //     }
    //
    //     // Buat catatan rekomendasi di database
    //     await prismaClient.recommendationList.create({
    //         data: {
    //             recommendation_id: recommendationId,
    //             rank: i + 1,
    //             description: `${menuOne.name}, ${menuTwo.name}, ${menuThree.name}, ${menuFour.name}`,
    //             total_price: menuOne.price + menuTwo.price + menuThree.price + menuFour.price,
    //             NutritionSummary: {
    //                 create: {
    //                     calory: recommendationDetail.calory,
    //                     protein: recommendationDetail.protein,
    //                     fat: recommendationDetail.fat,
    //                     carbohydrate: recommendationDetail.carbohydrate
    //                 }
    //             },
    //             RecommendationListDetail: {
    //                 createMany: {
    //                     data: [
    //                         {
    //                             menu_id: menuOne.id,
    //                             menu_name: menuOne.name,
    //                             menu_category: menuOne.category,
    //                             menu_portion: menuOne.portion,
    //                             menu_price: menuOne.price,
    //                             menu_description: menuOne.description,
    //                             image_url: menuOne.image_url
    //                         },
    //                         {
    //                             menu_id: menuTwo.id,
    //                             menu_name: menuTwo.name,
    //                             menu_category: menuTwo.category,
    //                             menu_portion: menuTwo.portion,
    //                             menu_price: menuTwo.price,
    //                             menu_description: menuTwo.description,
    //                             image_url: menuTwo.image_url
    //                         },
    //                         {
    //                             menu_id: menuThree.id,
    //                             menu_name: menuThree.name,
    //                             menu_category: menuThree.category,
    //                             menu_portion: menuThree.portion,
    //                             menu_price: menuThree.price,
    //                             menu_description: menuThree.description,
    //                             image_url: menuThree.image_url
    //                         },
    //                         {
    //                             menu_id: menuFour.id,
    //                             menu_name: menuFour.name,
    //                             menu_category: menuFour.category,
    //                             menu_portion: menuFour.portion,
    //                             menu_price: menuFour.price,
    //                             menu_description: menuFour.description,
    //                             image_url: menuFour.image_url
    //                         }
    //                     ]
    //                 }
    //             }
    //         }
    //     });
    // }
}
