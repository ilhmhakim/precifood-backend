import { RecipeItemType } from '@prisma/client';
import { z, ZodType } from 'zod';

export class RecipeValidation {
  static readonly SET: ZodType = z.object({
    restaurant_id: z
      .string()
      .trim()
      .min(38, 'ID restoran tidak valid')
      .max(38, 'ID restoran tidak valid'),
    menu_id: z.number().int().positive('Menu ID harus bernilai positif'),
    items: z
      .array(
        z.object({
          item_id: z.number().int().positive(),
          item_type: z.nativeEnum(RecipeItemType),
          quantity_grams: z.number().positive(),
        })
      )
      .default([]),
  });

  static readonly REFRESH: ZodType = z.object({
    restaurant_id: z
      .string()
      .trim()
      .min(38, 'ID restoran tidak valid')
      .max(38, 'ID restoran tidak valid'),
    menu_id: z.number().positive('Menu ID harus bernilai positif'),
  });
}
