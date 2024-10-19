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
        weight_per_portion: number | null;
        weight_with_bdd: number | null;
        calory: number | null;
        protein: number | null;
        fat: number | null;
        carbohydrate: number | null;
        fiber: number | null;
        natrium: number | null;
        cholesterol: number | null;
        sfa: number | null;
        mufa: number | null;
        pufa: number | null;
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

export type GetAllMenuRequest = {
    restaurant_id: string;
    role: string;
}

export type GetMenuDetailRequest = {
    restaurant_id: string;
    menu_id: number;
}

export type DeleteMenuRequest = GetMenuDetailRequest;

export type SearchMenuRequest = {
    restaurant_id: string;
    role: string;
    name?: string;
    category?: string;
    price?: string;
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
    if (!nutrition) {
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
                weight_per_portion: null,
                weight_with_bdd: null,
                calory: null,
                protein: null,
                fat: null,
                carbohydrate: null,
                fiber: null,
                natrium: null,
                cholesterol: null,
                sfa: null,
                mufa: null,
                pufa: null
            }
        }
    }

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
