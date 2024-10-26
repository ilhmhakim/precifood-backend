import {z, ZodType} from "zod";

export class AuthValidation {
    static readonly LOGIN: ZodType = z.object({
        email: z.string().email(),
        password: z.string().min(8)
    });

    static readonly REFRESH: ZodType = z.object({
        refresh_token: z.string()
    })
}
