import {z, ZodType} from "zod";

export class MenuValidation {
    static readonly CREATEMENU: ZodType = z.object({
        restaurant_id: z.string().min(38).max(38),
        name: z.string().min(1).max(255),
        category: z.string().min(1).max(50),
        price: z.number().positive(),
        portion: z.number().positive(),
        description: z.string().min(1),
        image_url: z.string().min(1)
    });

    static readonly UPDATEMENU: ZodType = z.object({
        restaurant_id: z.string().min(38).max(38),
        menu_id: z.number().positive(),
        name: z.string().min(1).max(255),
        category: z.string().min(1).max(50),
        price: z.number().positive(),
        portion: z.number().positive(),
        description: z.string().min(1),
        image_url: z.string().min(1)
    });

    static readonly DELETEMENU: ZodType = z.object({
        restaurant_id: z.string().min(38).max(38),
        menu_id: z.number().positive()
    });

    static readonly CREATEMENUNUTRITION = z.object({
        menu_id: z.number().positive(),
        weight_per_portion: z.number().positive(),
        calory: z.number().positive(),
        protein: z.number().positive(),
        fat: z.number().positive(),
        carbohydrate: z.number().positive(),
        sodium: z.number().positive(),
        cholesterol: z.number().positive(),
        sfa: z.number().positive(),
        mufa: z.number().positive(),
        pufa: z.number().positive()
    });

    static readonly UPDATEMENUNUTRITION = z.object({
        menu_id: z.number().positive(),
        weight_per_portion: z.number().positive(),
        calory: z.number().positive(),
        protein: z.number().positive(),
        fat: z.number().positive(),
        carbohydrate: z.number().positive(),
        sodium: z.number().positive(),
        cholesterol: z.number().positive(),
        sfa: z.number().positive(),
        mufa: z.number().positive(),
        pufa: z.number().positive()
    });
}