import {z, ZodType} from "zod";

export class AuthValidation {
    static readonly LOGIN: ZodType = z.object({
        email: z.string().email(),
        password: z.string().min(8)
    });

    static readonly REFRESH: ZodType = z.object({
        refresh_token: z.string()
    });

    static readonly UPDATEEMAIL: ZodType = z.object({
        user_id: z.string().min(38).max(38),
        new_email: z.string().email(),
        password: z.string().min(8)
    });

    static readonly UPDATEPASSWORD: ZodType = z.object({
        user_id: z.string().min(38).max(38),
        old_password: z.string().min(8),
        new_password: z.string().min(8),
        password_confirmation: z.string().min(8)
    })

}
