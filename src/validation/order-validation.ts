import { z, ZodType } from 'zod';

export class OrderValidation {
    static readonly CREATEORDER: ZodType = z.object({
        consumer_id: z.string()
            .trim()
            .min(38, "ID tidak valid")
            .max(38, "ID tidak valid"),
        recommendation_id: z.number()
            .positive("Recommendation ID harus bernilai positif")
    });

    static readonly GETALLORDER: ZodType = z.object({
        consumer_id: z.string()
            .trim()
            .min(38, "ID tidak valid")
            .max(38, "ID tidak valid")
    });

    static readonly GETORDERDETAIL: ZodType = z.object({
        consumer_id: z.string()
            .trim()
            .min(38, "ID tidak valid")
            .max(38, "ID tidak valid"),
        order_id: z.number()
            .positive("Order ID harus bernilai positif")
    });
}
