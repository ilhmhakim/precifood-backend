import { z, ZodType } from 'zod';

export class OrderValidation {
    static readonly CREATEORDER: ZodType = z.object({
        recommendation_id: z.number().positive()
    });

    static readonly GETALLORDER: ZodType = z.object({
        consumer_id: z.string().min(38).max(38)
    });

    static readonly GETORDERDETAIL: ZodType = z.object({
        consumer_id: z.string().min(38).max(38),
        order_id: z.number().positive()
    });
}
