
export type MenuResponse = {
    name: string;
    price: number;
    portion: number;
    category: string;
    description: string;
    image_url: string;
}

export type CreateMenuRequest = {
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

export type CreateMenuNutritionRequest = {
    menu_id: number;
    weigth_per_portion: number;
    calory: number;
    protein: number;
    fat: number;
    carbohydrate: number;
    sodium: number;
    cholesterol: number;
    sfa: number;
    mufa: number;
}

export type UpdateMenuNutritionRequest = {
    menu_id: number;
    weigth_per_portion: number;
    calory: number;
    protein: number;
    fat: number;
    carbohydrate: number;
    sodium: number;
    cholesterol: number;
    sfa: number;
    mufa: number;
}

export type UpdateMenuApprovalRequest = {
    restaurant_id: string;
    menu_id: number;
    status: string;
}
