import {Recommendation, RecommendationList, RecommendationListDetail} from "@prisma/client";
import {number} from "zod";

export type RecommendationDetail = {
    rekomendasi: string;
    makanan_pokok: number;
    lauk_pauk: number;
    sayuran: number;
    minuman: number;
    calory: number;
    protein: number;
    fat: number;
    carbohydrate: number;
    natrium: number;
    cholesterol: number;
    mufa: number;
    pufa: number;
    sfa: number;
    fitness: number;
}

export type RecommendationResponse = {
    restaurant_id: string;
    restaurant_name: string;
    recommended_at: string;
    recommendations: {
        id: number;
        rank: number;
        description: string;
        total_price: number;
        image_url: {
            url: string
        }[];
    }[];
}

export type RecommendationDetailResponse = {
    total_price: number;
    recommendations: Array<{
        id: number;
        name: string;
        category: string;
        portion: number;
        price: number;
        description: string;
        image_url: string;
    }>;
};


export type GetRecommendationRequest = {
    consumer_id: string;
    restaurant_id: string;
}

export type GetRecommendationListRequest = {
    restaurant_id: string;
    recommendation_id: number;
}


export type GetRecommendationListDetailRequest = {
    recommendation_id: number;
}

export function toGetRecommendation(recommendation: Recommendation, recommendationLists: (RecommendationList & { RecommendationListDetail: RecommendationListDetail[] })[]): RecommendationResponse {
    return {
        restaurant_id: recommendation.restaurant_id,
        restaurant_name: recommendation.restaurant_name,
        recommended_at: recommendation.recommended_at.toLocaleDateString(),
        recommendations: recommendationLists.map(list => ({
            id: list.id,
            rank: list.rank,
            description: list.description,
            total_price: list.total_price,
            image_url: list.RecommendationListDetail.map(detail => ({
                url: detail.image_url
            }))
        }))
    };
}


// Fungsi untuk mengonversi ke RecommendationDetailResponse
export function toGetRecommendationDetail(
    recommendationList: RecommendationList,
    recommendationDetails: RecommendationListDetail[]
): RecommendationDetailResponse {
    return {
        total_price: recommendationList.total_price,
        recommendations: recommendationDetails.map(detail => ({
            id: detail.menu_id,
            name: detail.menu_name,
            category: detail.menu_category,
            portion: detail.menu_portion,
            price: detail.menu_price,
            description: detail.menu_description,
            image_url: detail.image_url
        }))
    };
}

