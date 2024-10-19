import {Menu, Nutrition} from "@prisma/client";

export type MenuResponse = {
    id: number;
    name: string;
    price: number;
    status: string;
    portion: number;
    category: string;
    description: string;
    image_url: string;
    nutrition?: {
        weight_per_portion: number;
        weight_with_bdd: number;
        calory: number;
        protein: number;
        fat: number;
        carbohydrate: number;
        fiber: number;
        natrium: number;
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
    name?: string;
    category?: string;
    price?: number;
    portion?: number;
    description?: string;
    image_url?: string;
}

export type GetMenuRequest = {
    restaurant_id: string;
    menu_id: number;
}

export type DeleteMenuRequest = GetMenuRequest;

export type SearchMenuRequest = {
    restaurant_id: string;
    name: string;
}

export type FilterMenuRequest = {
    restaurant_id: string;
    category?: string;
    price?: number;
    status?: string;
}

export type CreateMenuNutritionRequest = {
    restaurant_id: string;
    menu_id: number;
    weight_per_portion: number;
    weight_with_bdd: number;
    calory: number;
    protein: number;
    fat: number;
    carbohydrate: number;
    fiber: number;
    natrium: number;
    cholesterol: number;
    sfa: number;
    mufa: number;
    pufa: number;
}

export type UpdateMenuNutritionRequest = {
    restaurant_id: string;
    menu_id: number;
    weight_per_portion?: number;
    weight_with_bdd?: number;
    calory?: number;
    protein?: number;
    fat?: number;
    carbohydrate?: number;
    fiber?: number;
    natrium?: number;
    cholesterol?: number;
    sfa?: number;
    mufa?: number;
    pufa?: number;
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
        status: menu.status,
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
        status: menu.status,
        price: menu.price,
        portion: menu.portion,
        category: menu.category,
        description: menu.description,
        image_url: menu.image_url,
        nutrition: {
            weight_per_portion: nutrition.weight_per_portion,
            weight_with_bdd: nutrition.weight_with_bdd,
            calory: nutrition.calory,
            protein: nutrition.protein.toNumber(),
            fat: nutrition.fat.toNumber(),
            carbohydrate: nutrition.carbohydrate.toNumber(),
            fiber: nutrition.fiber.toNumber(),
            natrium: nutrition.natrium.toNumber(),
            cholesterol: nutrition.cholesterol.toNumber(),
            sfa: nutrition.sfa.toNumber(),
            mufa: nutrition.mufa.toNumber(),
            pufa: nutrition.pufa.toNumber()
        }
    }
}
