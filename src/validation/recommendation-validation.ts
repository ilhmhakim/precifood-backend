import { z, ZodType } from 'zod';

export class RecommendationValidation {
    static readonly GETRECOMMENDATION: ZodType = z.object({
        consumer_id: z.string()
            .trim()
            .min(38, "ID tidak valid")
            .max(38, "ID tidak valid"),
        restaurant_id: z.string()
            .trim()
            .min(38, "ID tidak valid")
            .max(38, "ID tidak valid"),
        recommendation_id: z.number()
            .positive("Recommendation ID harus bernilai positif")
            .optional()
    });
}
