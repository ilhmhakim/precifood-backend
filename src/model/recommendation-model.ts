import {Recommendation} from "@prisma/client";

export type RecommendationResponse = {
    restaurant_id: string;
    restaurant_name: number;
    recommended_at: string;
    list?: {
        recommendation_id: number;
        list_id: number;
        rank: number;
        description: string;
        total_price: number;
        detail?: {
            menu_id: number;
            menu_name: string;
            menu_category: string;
            menu_price: number;
            image_url: string;
        }
    } [],

}

export type GetRecommendationRequest = {
    consumer_id: string;
    restaurant_id: string;
}

export type GetMenuRecommendationDetailRequest = {
    consumer_id: string;
    restaurant_id: string;
    recommendation_id: number;
}