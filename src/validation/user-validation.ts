import {z, ZodType} from "zod";
import {ConsumerSex} from "../type/user";

export class UserValidation {
    static readonly REGISTERCONSUMER: ZodType = z.object({
        name: z.string().min(1).max(255),
        email: z.string().min(1).max(255),
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
}