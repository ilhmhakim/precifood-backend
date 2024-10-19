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
        name: z.string().min(1).max(255).optional(),
        category: z.string().min(1).max(50).optional(),
        price: z.number().positive().optional(),
        portion: z.number().positive().optional(),
        description: z.string().min(1).optional(),
        image_url: z.string().min(1).optional()
    });

    static readonly DELETEMENU: ZodType = z.object({
        restaurant_id: z.string().min(38).max(38),
        menu_id: z.number().positive()
    });

    static readonly CREATEMENUNUTRITION = z.object({
        restaurant_id: z.string().min(38).max(38),
        menu_id: z.number().positive(),
        weight_per_portion: z.number().positive(),
        weight_with_bdd: z.number().positive(),
        calory: z.number().positive(),
        protein: z.number().positive().refine(val => /^\d+(\.\d{1,2})?$/.test(val.toString()), {
            message: "Protein harus memiliki maksimal 1 atau 2 angka di belakang koma"
        }),
        fat: z.number().positive().refine(val => /^\d+(\.\d{1,2})?$/.test(val.toString()), {
            message: "Lemak harus memiliki maksimal 1 atau 2 angka di belakang koma"
        }),
        carbohydrate: z.number().positive().refine(val => /^\d+(\.\d{1,2})?$/.test(val.toString()), {
            message: "Karbohidrat harus memiliki maksimal 1 atau 2 angka di belakang koma"
        }),
        fiber: z.number().positive().refine(val => /^\d+(\.\d{1,2})?$/.test(val.toString()), {
            message: "Serat harus memiliki maksimal 1 atau 2 angka di belakang koma"
        }),
        sfa: z.number().positive().refine(val => /^\d+(\.\d{1,2})?$/.test(val.toString()), {
            message: "SFA harus memiliki maksimal 1 atau 2 angka di belakang koma"
        }),
        mufa: z.number().positive().refine(val => /^\d+(\.\d{1,2})?$/.test(val.toString()), {
            message: "MUFA harus memiliki maksimal 1 atau 2 angka di belakang koma"
        }),
        pufa: z.number().positive().refine(val => /^\d+(\.\d{1,2})?$/.test(val.toString()), {
            message: "PUFA harus memiliki maksimal 1 atau 2 angka di belakang koma"
        }),
        natrium: z.number().positive().refine(val => /^\d+(\.\d{1,2})?$/.test(val.toString()), {
            message: "Natrium harus memiliki maksimal 2 angka di belakang koma"
        }),
        cholesterol: z.number().positive().refine(val => /^\d+(\.\d{1,2})?$/.test(val.toString()), {
            message: "Kolesterol harus memiliki maksimal 2 angka di belakang koma"
        }),
    });


static readonly UPDATEMENUNUTRITION = z.object({
        restaurant_id: z.string().min(38).max(38),
        menu_id: z.number().positive(),
        weight_per_portion: z.number().positive().optional(),
        weight_with_bdd: z.number().positive(),
        calory: z.number().positive().optional(),
        protein: z.number().positive().refine(val => /^\d+(\.\d{1,2})?$/.test(val.toString()), {
            message: "Protein harus memiliki maksimal 1 atau 2 angka di belakang koma"
        }).optional(),
        fat: z.number().positive().refine(val => /^\d+(\.\d{1,2})?$/.test(val.toString()), {
            message: "Lemak harus memiliki maksimal 1 atau 2 angka di belakang koma"
        }).optional(),
        carbohydrate: z.number().positive().refine(val => /^\d+(\.\d{1,2})?$/.test(val.toString()), {
            message: "Karbohidrat harus memiliki maksimal 1 atau 2 angka di belakang koma"
        }).optional(),
        fiber: z.number().positive().refine(val => /^\d+(\.\d{1,2})?$/.test(val.toString()), {
            message: "Serat harus memiliki maksimal 1 atau 2 angka di belakang koma"
        }).optional(),
        sfa: z.number().positive().refine(val => /^\d+(\.\d{1,2})?$/.test(val.toString()), {
            message: "SFA harus memiliki maksimal 1 atau 2 angka di belakang koma"
        }).optional(),
        mufa: z.number().positive().refine(val => /^\d+(\.\d{1,2})?$/.test(val.toString()), {
            message: "MUFA harus memiliki maksimal 1 atau 2 angka di belakang koma"
        }).optional(),
        pufa: z.number().positive().refine(val => /^\d+(\.\d{1,2})?$/.test(val.toString()), {
            message: "PUFA harus memiliki maksimal 1 atau 2 angka di belakang koma"
        }).optional(),
        natrium: z.number().positive().refine(val => /^\d+(\.\d{1,2})?$/.test(val.toString()), {
            message: "Natrium harus memiliki maksimal 2 angka di belakang koma"
        }).optional(),
        cholesterol: z.number().positive().refine(val => /^\d+(\.\d{1,2})?$/.test(val.toString()), {
            message: "Kolesterol harus memiliki maksimal 2 angka di belakang koma"
        }).optional(),
    });

    static readonly UPDATEMENUAPPROVAL = z.object({
        restaurant_id: z.string().min(38).max(38),
        menu_id: z.number().positive(),
        status: z.string().min(1)
    });
}