export interface Menu {
  id: number;
  name: string;
  price: number;
  portion: number;
  category: string;
  description: string;
  status: string;
  image_url: string;
  nutrition?: Nutrition;
}

export interface Nutrition {
  weight_per_portion: number;
  weight_with_bdd: number;
  calory: number;
  protein: number;
  fat: number;
  carbohydrate: number;
  fiber: number;
  natrium: number;
  cholesterol: number;
  mufa: number;
  pufa: number;
  sfa: number;
}

export const MENU_CATEGORIES = [
  "Semua",
  "Makanan Pokok",
  "Lauk Pauk",
  "Sayuran",
  "Kudapan",
  "Minuman",
] as const;

export interface Recommendation {
  total_price: number;
  recommendations: Menu[];
  nutrition_summary: NutritionSummary;
}

export interface SimpleRecommendation {
  id: number;
  rank: number;
  description: string;
  total_price: number;
  image_url: { url: string }[];
}

export interface IndexRecommendation {
  restaurant_id: string;
  restaurant_name: string;
  recommended_at: number;
  status: {
    is_generating: boolean;
    generator_error: string | null;
  };
  recommendations: SimpleRecommendation[];
}

export interface NutritionSummary {
  calory: number;
  protein: number;
  fat: number;
  carbohydrate: number;
}
