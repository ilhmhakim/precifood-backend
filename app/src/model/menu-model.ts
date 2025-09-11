import { ResponseError } from '../error/response-error';
import { Menu, Nutrition } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

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

export type NutritionPerPortion = {
  weight_per_portion?: number | string | null;
  weight_with_bdd?: number | string | null;
  calory?: Decimal | null;
  protein?: Decimal | null;
  fat?: Decimal | null;
  carbohydrate?: Decimal | null;
  fiber?: Decimal | null;
  natrium?: Decimal | null;
  cholesterol?: Decimal | null;
  sfa?: Decimal | null;
  mufa?: Decimal | null;
  pufa?: Decimal | null;
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
  nutrition_per_portion?: {
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

export type RecipeItemInput = {
  item_id: number;
  item_type: 'bahan' | 'bumbu';
  quantity_grams: number;
};

export type SetMenuRecipeRequest = {
  restaurant_id: string;
  menu_id: number;
  items: RecipeItemInput[];
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
  nutritionPerPortion: NutritionPerPortion | null,
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
        calory: nutrition?.calory
          ? nutrition.calory.toDecimalPlaces(1).toNumber()
          : noValueMessage,
        protein: nutrition?.protein
          ? nutrition.protein.toDecimalPlaces(1).toNumber()
          : noValueMessage,
        fat: nutrition?.fat
          ? nutrition.fat.toDecimalPlaces(1).toNumber()
          : noValueMessage,
        carbohydrate: nutrition?.carbohydrate
          ? nutrition.carbohydrate.toDecimalPlaces(1).toNumber()
          : noValueMessage,
      },
      nutrition_per_portion: {
        calory:
          nutritionPerPortion?.calory?.toDecimalPlaces(1).toNumber() ??
          noValueMessage,
        protein:
          nutritionPerPortion?.protein?.toDecimalPlaces(1).toNumber() ??
          noValueMessage,
        fat:
          nutritionPerPortion?.fat?.toDecimalPlaces(1).toNumber() ??
          noValueMessage,
        carbohydrate:
          nutritionPerPortion?.carbohydrate?.toDecimalPlaces(1).toNumber() ??
          noValueMessage,
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
        weight_per_portion: nutrition?.weight_per_portion ?? noValueMessage,
        weight_with_bdd: nutrition?.weight_with_bdd ?? noValueMessage,
        calory: nutrition?.calory
          ? nutrition.calory.toDecimalPlaces(1).toNumber()
          : noValueMessage,
        protein: nutrition?.protein
          ? nutrition.protein.toDecimalPlaces(1).toNumber()
          : noValueMessage,
        fat: nutrition?.fat
          ? nutrition.fat.toDecimalPlaces(1).toNumber()
          : noValueMessage,
        carbohydrate: nutrition?.carbohydrate
          ? nutrition.carbohydrate.toDecimalPlaces(1).toNumber()
          : noValueMessage,
        fiber: nutrition?.fiber
          ? nutrition.fiber.toDecimalPlaces(1).toNumber()
          : noValueMessage,
        natrium: nutrition?.natrium
          ? nutrition.natrium.toDecimalPlaces(1).toNumber()
          : noValueMessage,
        cholesterol: nutrition?.cholesterol
          ? nutrition.cholesterol.toDecimalPlaces(2).toNumber()
          : noValueMessage,
        sfa: nutrition?.sfa
          ? nutrition.sfa.toDecimalPlaces(2).toNumber()
          : noValueMessage,
        mufa: nutrition?.mufa
          ? nutrition.mufa.toDecimalPlaces(2).toNumber()
          : noValueMessage,
        pufa: nutrition?.pufa
          ? nutrition.pufa.toDecimalPlaces(2).toNumber()
          : noValueMessage,
      },
      nutrition_per_portion: {
        weight_per_portion: nutrition?.weight_per_portion ?? noValueMessage,
        weight_with_bdd: nutrition?.weight_with_bdd ?? noValueMessage,
        calory:
          nutritionPerPortion?.calory?.toDecimalPlaces(1).toNumber() ??
          noValueMessage,
        protein:
          nutritionPerPortion?.protein?.toDecimalPlaces(1).toNumber() ??
          noValueMessage,
        fat:
          nutritionPerPortion?.fat?.toDecimalPlaces(1).toNumber() ??
          noValueMessage,
        carbohydrate:
          nutritionPerPortion?.carbohydrate?.toDecimalPlaces(1).toNumber() ??
          noValueMessage,
        fiber:
          nutritionPerPortion?.fiber?.toDecimalPlaces(1).toNumber() ??
          noValueMessage,
        natrium:
          nutritionPerPortion?.natrium?.toDecimalPlaces(1).toNumber() ??
          noValueMessage,
        cholesterol:
          nutritionPerPortion?.cholesterol?.toDecimalPlaces(2).toNumber() ??
          noValueMessage,
        sfa:
          nutritionPerPortion?.sfa?.toDecimalPlaces(2).toNumber() ??
          noValueMessage,
        mufa:
          nutritionPerPortion?.mufa?.toDecimalPlaces(2).toNumber() ??
          noValueMessage,
        pufa:
          nutritionPerPortion?.pufa?.toDecimalPlaces(2).toNumber() ??
          noValueMessage,
      },
    };
  } else {
    throw new ResponseError(400, 'Invalid request');
  }
}
