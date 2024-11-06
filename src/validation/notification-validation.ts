import { z, ZodType } from 'zod';

export class NotificationValidation {
    static readonly UPDATENOTIFICATIONREAD: ZodType = z.object({
        id: z.number()
            .positive("Notification ID harus bernilai positif"),
        is_read: z.boolean()
            .refine(val => typeof val === 'boolean', {
                message: "Status baca harus berupa nilai boolean"
            })
    });
}
