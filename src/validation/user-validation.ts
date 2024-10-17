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
        address: z.string().min(1),
        image: z.string().min(1),
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
}
