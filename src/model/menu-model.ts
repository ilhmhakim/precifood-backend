import {Menu, Nutrition} from "@prisma/client";

export type MenuResponse = {
    id: number;
    name: string;
    price: number;
    portion: number;
    category: string;
    description: string;
    image_url: string;
    nutrition?: {
        weight_per_portion: number;
        calory: number;
        protein: number;
        fat: number;
        carbohydrate: number;
        sodium: number;
        cholesterol: number;
        sfa: number;
        mufa: number;
        pufa: number;
    }
}

export type CreateMenuRequest = {
    restaurant_id: string;
    name: string;
    category: string;
    price: number;
    portion: number;
    description: string;
    image_url: string;
}

export type UpdateMenuRequest = {
    restaurant_id: string;
    menu_id: number;
    name: string;
    category: string;
    price: number;
    portion: number;
    description: string;
    image_url: string;
}

export type GetMenuRequest = {
    restaurant_id: string;
    menu_id: number;
}

export type DeleteMenuRequest = GetMenuRequest;

export type SearchMenuRequest = {
    name: string;
}

export type FilterMenuRequest = {
    category?: string;
    price?: number;
    status?: string;
}

export type MenuNutritionResponse = {
    weigth_per_portion: number;
    calory: number;
    protein: number;
    fat: number;
    carbohydrate: number;
    sodium: number;
    cholesterol: number;
    sfa: number;
    mufa: number;
    pufa: number;
}

export type CreateMenuNutritionRequest = {
    menu_id: number;
    weight_per_portion: number;
    calory: number;
    protein: number;
    fat: number;
    carbohydrate: number;
    sodium: number;
    cholesterol: number;
    sfa: number;
    mufa: number;
    pufa: number;
}

export type UpdateMenuNutritionRequest = {
    menu_id: number;
    weight_per_portion: number;
    calory: number;
    protein: number;
    fat: number;
    carbohydrate: number;
    sodium: number;
    cholesterol: number;
    sfa: number;
    mufa: number;
    pufa: number;
}

export type UpdateMenuApprovalRequest = {
    restaurant_id: string;
    menu_id: number;
    status: string;
}

export function toMenuResponse(menu: Menu): MenuResponse {
    return {
        id: menu.id,
        name: menu.name,
        price: menu.price,
        portion: menu.portion,
        category: menu.category,
        description: menu.description,
        image_url: menu.image_url
    }
}

export function toMenuDetailResponse(menu: Menu, nutrition: Nutrition): MenuResponse {
    return {
        id: menu.id,
        name: menu.name,
        price: menu.price,
        portion: menu.portion,
        category: menu.category,
        description: menu.description,
        image_url: menu.image_url,
        nutrition: {
            weight_per_portion: nutrition.weight_per_portion,
            calory: nutrition.calory,
            protein: nutrition.protein,
            fat: nutrition.fat,
            carbohydrate: nutrition.carbohydrate,
            sodium: nutrition.sodium,
            cholesterol: nutrition.cholesterol,
            sfa: nutrition.sfa,
            mufa: nutrition.mufa,
            pufa: nutrition.pufa
        }
    }
}
