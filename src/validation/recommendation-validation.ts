import { z, ZodType } from 'zod';

export class RecommendationValidation {
    static readonly GETRECOMMENDATION: ZodType = z.object({
        consumer_id: z.string().min(38).max(38),
        restaurant_id: z.string().min(38).max(38)
    });
}
