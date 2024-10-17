import { z, ZodType } from 'zod';

export class NotificationValidation {
    static readonly UPDATENOTIFICATIONREAD: ZodType = z.object({
        id: z.number().positive(),
        is_read: z.boolean()
    });
}
