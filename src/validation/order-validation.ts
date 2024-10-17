import { z, ZodType } from 'zod';

export class OrderValidation {
    static readonly CREATEORDER: ZodType = z.object({
        consumer_id: z.string().min(38).max(38),
        restaurant_id: z.string().min(1, "Restaurant ID is required"),
        restaurant_name: z.string().min(1, "Restaurant name is required"),
        total_price: z.number().positive("Total price must be a positive number"),
        detail: z.array(z.object({
            menu_id: z.number().positive("Menu ID must be a positive number"),
            menu_name: z.string().min(1, "Menu name is required"),
            menu_category: z.string().min(1, "Menu category is required"),
            menu_price: z.number().positive("Menu price must be a positive number"),
        }))
    });
}
