import {Recommendation} from "@prisma/client";
export type RecommendationResponse = RecommendationDetail[];

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



export type RecommendationResponses = {
    restaurant_id: string;
    restaurant_name: number;
    recommended_at: string;
    list?: {
        list_id: number;
        rank: number;
        description: string;
        total_price: number;
        detail: {
            menu_id: number;
            menu_name: string;
            menu_category: string;
            menu_price: number;
            image_url: string;
        } [],
        nutrition_review?: {
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

export type ModelResponse = {
    recommendation_1: {
        recommendation: string;
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
    },
    recommendation_2: {
        recommendation: string;
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
    },
    recommendation_3: {
        recommendation: string;
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
    },
    recommendation_4: {
        recommendation: string;
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
    },
    recommendation_5: {
        recommendation: string;
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
    },
    recommendation_6: {
        recommendation: string;
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
    },
    recommendation_7: {
        recommendation: string;
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
    },
    recommendation_8: {
        recommendation: string;
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
    },
    recommendation_9: {
        recommendation: string;
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
    },
    recommendation_10: {
        recommendation: string;
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
}