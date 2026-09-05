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
          quantity_grams: z
            .number()
            .positive('Jumlah bahan harus bernilai positif')
            .max(10000, 'Jumlah bahan maksimal 10000 gram per item'),
        })
      )
      .default([]),
  });

  static readonly REFRESHNUTRITION: ZodType = z.object({
    restaurant_id: z
      .string()
      .trim()
      .min(38, 'ID restoran tidak valid')
      .max(38, 'ID restoran tidak valid'),
    menu_id: z.number().positive('Menu ID harus bernilai positif'),
  });
}
