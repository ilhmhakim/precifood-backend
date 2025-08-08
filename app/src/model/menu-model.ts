import { ResponseError } from '../error/response-error';
import { Menu, Nutrition } from '@prisma/client';

export type AllMenusResponse = {
    id: number;
    name: string;
    price: number;
    status: string;
    portion: number;
    category: string;
    description: string;
    image_url: string;
};

export type MenuDetailResponse = {
    id: number;
    name: string;
    price: number;
    status: string;
    portion: number;
    category: string;
    description: string;
    image_url: string;
    nutrition: {
        weight_per_portion?: number | string | null;
        weight_with_bdd?: number | string | null;
        calory?: number | string | null;
        protein?: number | string | null;
        fat?: number | string | null;
        carbohydrate?: number | string | null;
        fiber?: number | string | null;
        natrium?: number | string | null;
        cholesterol?: number | string | null;
        sfa?: number | string | null;
        mufa?: number | string | null;
        pufa?: number | string | null;
    };
};

export type CreateMenuRequest = {
    restaurant_id: string;
    name: string;
    category: string;
    price: number;
    portion: number;
    description: string;
    image_url: string;
};

export type UpdateMenuRequest = {
    restaurant_id: string;
    menu_id: number;
    name?: string;
    category?: string;
    price?: number;
    portion?: number;
    description?: string;
    image_url?: string;
};

export type GetAllMenuRequest = {
    restaurant_id: string;
    role: string;
};

export type GetMenuDetailRequest = {
    restaurant_id: string;
    menu_id: number;
    role: string;
};

export type DeleteMenuRequest = GetMenuDetailRequest;

export type SearchMenuRequest = {
    restaurant_id: string;
    role: string;
    name?: string;
    category?: string;
    price?: string;
    status?: string;
};

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
};

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
};

export type UpdateMenuApprovalRequest = {
    restaurant_id: string;
    menu_id: number;
    status: string;
};

export function toAllMenusResponse(menu: Menu): AllMenusResponse {
    return {
        id: menu.id,
        name: menu.name,
        status: menu.status,
        price: menu.price,
        portion: menu.portion,
        category: menu.category,
        description: menu.description,
        image_url: menu.image_url,
    };
}

export function toMenuDetailResponse(
    menu: Menu,
    nutrition: Nutrition | null,
    role: string
): MenuDetailResponse {
    const noValueMessage = 'Nilai nutrisi belum dimasukkan';

    if (role === 'Konsumen' || role === 'Restoran') {
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
                calory: nutrition?.calory ?? noValueMessage,
                protein: nutrition?.protein
                    ? nutrition.protein.toNumber()
                    : noValueMessage,
                fat: nutrition?.fat ? nutrition.fat.toNumber() : noValueMessage,
                carbohydrate: nutrition?.carbohydrate
                    ? nutrition.carbohydrate.toNumber()
                    : noValueMessage,
            },
        };
    } else if (role === 'Admin') {
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
                weight_per_portion:
                    nutrition?.weight_per_portion ?? noValueMessage,
                weight_with_bdd: nutrition?.weight_with_bdd ?? noValueMessage,
                calory: nutrition?.calory ?? noValueMessage,
                protein: nutrition?.protein
                    ? nutrition.protein.toNumber()
                    : noValueMessage,
                fat: nutrition?.fat ? nutrition.fat.toNumber() : noValueMessage,
                carbohydrate: nutrition?.carbohydrate
                    ? nutrition.carbohydrate.toNumber()
                    : noValueMessage,
                fiber: nutrition?.fiber
                    ? nutrition.fiber.toNumber()
                    : noValueMessage,
                natrium: nutrition?.natrium
                    ? nutrition.natrium.toNumber()
                    : noValueMessage,
                cholesterol: nutrition?.cholesterol
                    ? nutrition.cholesterol.toNumber()
                    : noValueMessage,
                sfa: nutrition?.sfa ? nutrition.sfa.toNumber() : noValueMessage,
                mufa: nutrition?.mufa
                    ? nutrition.mufa.toNumber()
                    : noValueMessage,
                pufa: nutrition?.pufa
                    ? nutrition.pufa.toNumber()
                    : noValueMessage,
            },
        };
    } else {
        throw new ResponseError(400, 'Invalid request');
    }
}
