import {z, ZodType} from "zod";

export class UserValidation {
    static readonly REGISTERCONSUMER: ZodType = z.object({
        name: z.string().min(1).max(255),
        email: z.string().email(),
        sex: z.string().min(1).max(10),
        birth: z.string().min(1),
        phone: z.string().min(1).max(20),
        height: z.number().positive(),
        weight: z.number().positive(),
        no_history: z.boolean(),
        diabetes: z.boolean(),
        hypertension: z.boolean(),
        cardiovascular: z.boolean(),
        password: z.string().min(8),
        password_confirmation: z.string().min(8)
    });

    static readonly REGISTERRESTAURANT: ZodType = z.object({
        name: z.string().min(1).max(255),
        email: z.string().email(),
        phone: z.string().min(1).max(20),
        province: z.string().min(1).max(100),
        city: z.string().min(1).max(100),
        address_detail: z.string().min(1),
        image_url: z.string().min(1),
        password: z.string().min(8),
        password_confirmation: z.string().min(8)
    });

    static readonly REGISTERADMIN: ZodType = z.object({
        email: z.string().email(),
        password: z.string().min(8),
        password_confirmation: z.string().min(8)
    });

    static readonly GETUSERPROFILE: ZodType = z.object({
        id: z.string().min(38).max(38)
    });

    static readonly UPDATECONSUMER: ZodType = z.object({
        id: z.string().min(38, "ID tidak valid").max(38, "ID tidak valid"),
        name: z.string().min(1).max(255).optional(),       // Optional field
        email: z.string().email().optional(),              // Optional field
        sex: z.string().min(1).max(10).optional(),         // Optional field
        birth: z.string().min(1).optional(),               // Optional field
        phone: z.string().min(1).max(20).optional(),       // Optional field
        height: z.number().positive().optional(),          // Optional field
        weight: z.number().positive().optional(),          // Optional field
        no_history: z.boolean().optional(),                // Optional field
        diabetes: z.boolean().optional(),                  // Optional field
        hypertension: z.boolean().optional(),              // Optional field
        cardiovascular: z.boolean().optional(),            // Optional field
    });

    static readonly UPDATERESTAURANT: ZodType = z.object({
        id: z.string().min(38, "ID tidak valid").max(38, "ID tidak valid"),
        name: z.string().min(1).max(255).optional(),
        email: z.string().email().optional(),
        phone: z.string().min(1).max(20).optional(),
        province: z.string().min(1).max(100).optional(),
        city: z.string().min(1).max(100).optional(),
        address_detail: z.string().min(1).optional(),
        image: z.string().min(1).optional(),
    });

}
