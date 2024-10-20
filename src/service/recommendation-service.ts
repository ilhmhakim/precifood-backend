import {prismaClient} from "../application/database";
import {GetRecommendationRequest} from "../model/recommendation-model";
import {Validation} from "../validation/validation";
import {RecommendationValidation} from "../validation/recommendation-validation";
import {MenuService} from "./menu-service";

export class RecommendationService {

    // static async getRecommendation(request: GetRecommendationRequest) {
    //     const requestRecommendation = Validation.validate(RecommendationValidation.GETRECOMMENDATION, request);
    //
    //     // const targetUrl = `http://${process.env.CATEGORIZE_URL}/recommendation`
    //     // const payLoad = requestRecommendation;
    //     // const response = await axios.post(targetUrl, payLoad);
    //     /**
    //      * data :
    //      * rank
    //      *
    //      */
    //     const createRecommendation
    //     return {
    //
    //     }
    // }

    // static async createRecommendations(request: GetRecommendationRequest) {
    //     const requestRecommendation = Validation.validate(RecommendationValidation.GETRECOMMENDATION, request);
    //     const requestRestaurant = await MenuService.checkRestaurantExist(requestRecommendation.restaurant_id);
    //
    //     const createRecommendation = await prismaClient.recommendation.create({
    //         data: {
    //             consumer_id: requestRecommendation.consumer_id,
    //             restaurant_id: requestRestaurant.contact.restaurant_id,
    //             restaurant_name: requestRestaurant.contact.name,
    //             RecommendationList: {
    //                 createMany: {
    //                     data: {
    //                         rank: 1,
    //                         description: "",
    //                         total_price: 0,
    //                         RecommendationListDetail: {
    //                             createMany: {
    //                                 menu_id
    //                                 menu_category
    //                                 menu_price
    //                                 image_url: "",
    //                             }
    //                         }
    //
    //                     }
    //                 }
    //             }
    //         }
    //     })
    //
    //
    //     return {
    //         rank
    //         menus : { [
    //
    //                     menu_id
    //                 ]
    //         }
    //     }
    // }


}