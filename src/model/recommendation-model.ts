import {Consumer, NutritionSummary, Recommendation, RecommendationList, RecommendationListDetail} from "@prisma/client";

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
    recommended_at: number;
    status: {
        is_generating: boolean;
        generator_error: string | null;
    }
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
    nutrition_summary: {
        calory: number;
        protein: number;
        fat: number;
        carbohydrate: number;
    };
    recommendations: Array<{
        menu_id: number;
        name: string;
        category: string;
        portion: number;
        price: number;
        description: string;
        image_url: string;
    }>;
};

export type GenerateRecommendationRequest = {
    token: string;
    consumer_id: string;
    restaurant_id: string;
}

export type GetRecommendationRequest = {
    consumer_id: string;
    restaurant_id: string;
}

export type GetRecommendationListDetailRequest = {
    restaurant_id: string;
    consumer_id: string;
    recommendation_id: number;
}

export function toGetRecommendation(status: Consumer, recommendation: Recommendation, recommendationLists: (RecommendationList & { RecommendationListDetail: RecommendationListDetail[] })[]): RecommendationResponse {
    return {
        restaurant_id: recommendation.restaurant_id,
        restaurant_name: recommendation.restaurant_name,
        recommended_at: recommendation.recommended_at.getTime(),
        status: {
            is_generating: status.is_generating,
            generator_error: status.generator_error
        },
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
export function toGetRecommendationDetail(recommendationList: RecommendationList, nutritionSummary: NutritionSummary, recommendationDetails: RecommendationListDetail[]): RecommendationDetailResponse {
    return {
        total_price: recommendationList.total_price,
        nutrition_summary: {
            calory: nutritionSummary.calory,
            protein: nutritionSummary.protein.toNumber(),
            fat: nutritionSummary.carbohydrate.toNumber(),
            carbohydrate: nutritionSummary.carbohydrate.toNumber()
        },
        recommendations: recommendationDetails.map(detail => ({
            menu_id: detail.menu_id,
            name: detail.menu_name,
            category: detail.menu_category,
            portion: detail.menu_portion,
            price: detail.menu_price,
            description: detail.menu_description,
            image_url: detail.image_url
        }))
    };
}

