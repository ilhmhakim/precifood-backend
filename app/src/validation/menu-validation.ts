import { z, ZodType } from 'zod';

export class MenuValidation {
  static readonly GETALLMENU: ZodType = z.object({
    restaurant_id: z
      .string()
      .trim()
      .min(38, 'ID restoran tidak valid')
      .max(38, 'ID restoran tidak valid'),
    role: z.enum(['Konsumen', 'Restoran', 'Admin'], {
      errorMap: () => ({
        message: "Role harus bernilai 'Konsumen', 'Restoran', atau 'Admin'",
      }),
    }),
  });

  static readonly GETMENUDETAIL: ZodType = z.object({
    restaurant_id: z
      .string()
      .trim()
      .min(38, 'ID restoran tidak valid')
      .max(38, 'ID restoran tidak valid'),
    menu_id: z.number().positive('Menu ID harus bernilai positif'),
    role: z.enum(['Konsumen', 'Restoran', 'Admin'], {
      errorMap: () => ({
        message: "Role harus bernilai 'Konsumen', 'Restoran', atau 'Admin'",
      }),
    }),
  });

  static readonly CREATEMENU: ZodType = z.object({
    restaurant_id: z
      .string()
      .trim()
      .min(38, 'ID restoran tidak valid')
      .max(38, 'ID restoran tidak valid'),
    name: z
      .string()
      .trim()
      .min(1, 'Nama menu minimal 1 karakter')
      .max(255, 'Nama menu maksimal 255 karakter'),
    category: z.enum(
      ['Makanan Pokok', 'Lauk Pauk', 'Minuman', 'Sayuran', 'Snack'],
      {
        errorMap: () => ({
          message:
            "Kategori harus bernilai 'Makanan Pokok', 'Lauk Pauk', 'Minuman', 'Sayuran', atau 'Snack'",
        }),
      }
    ),
    price: z
      .string()
      .transform((val) => parseInt(val, 10))
      .refine((val) => !isNaN(val) && val > 0, {
        message: 'Harga harus bernilai positif dan berupa angka',
      }),
    portion: z
      .string()
      .transform((val) => parseInt(val, 10))
      .refine((val) => !isNaN(val) && val > 0, {
        message: 'Porsi harus bernilai positif dan berupa angka',
      }),
    description: z.string().trim().min(1, 'Deskripsi tidak boleh kosong'),
    image_url: z.string().trim().min(1, 'URL gambar tidak boleh kosong'),
  });

  static readonly UPDATEMENU: ZodType = z.object({
    restaurant_id: z
      .string()
      .trim()
      .min(38, 'ID restoran tidak valid')
      .max(38, 'ID restoran tidak valid'),
    menu_id: z.number().positive('Menu ID harus bernilai positif'),
    name: z.string().trim().min(1).max(255).optional(),
    category: z
      .enum(['Makanan Pokok', 'Lauk Pauk', 'Minuman', 'Sayuran', 'Snack'], {
        errorMap: () => ({
          message:
            "Kategori harus bernilai 'Makanan Pokok', 'Lauk Pauk', 'Minuman', 'Sayuran', atau 'Snack'",
        }),
      })
      .optional(),
    price: z
      .string()
      .transform((val) => parseInt(val, 10))
      .refine((val) => !isNaN(val) && val > 0, {
        message: 'Harga harus bernilai positif dan berupa angka',
      })
      .optional(),
    portion: z
      .string()
      .transform((val) => parseInt(val, 10))
      .refine((val) => !isNaN(val) && val > 0, {
        message: 'Porsi harus bernilai positif dan berupa angka',
      })
      .optional(),
    description: z.string().trim().min(1).optional(),
    image_url: z.string().trim().min(1).optional(),
  });

  static readonly DELETEMENU: ZodType = z.object({
    restaurant_id: z
      .string()
      .trim()
      .min(38, 'ID restoran tidak valid')
      .max(38, 'ID restoran tidak valid'),
    menu_id: z.number().positive('Menu ID harus bernilai positif'),
  });

  static readonly CREATEMENUNUTRITION = z.object({
    restaurant_id: z
      .string()
      .trim()
      .min(38, 'ID restoran tidak valid')
      .max(38, 'ID restoran tidak valid'),
    menu_id: z.number().positive('Menu ID harus bernilai positif'),
    weight_per_portion: z
      .number()
      .positive('Berat per porsi harus bernilai positif'),
    weight_with_bdd: z
      .number()
      .positive('Berat dengan BDD harus bernilai positif'),
    calory: z.number().positive('Kalori harus bernilai positif'),
    protein: z
      .number()
      .positive()
      .refine((val) => /^\d+(\.\d{1,2})?$/.test(val.toString()), {
        message:
          'Protein harus memiliki maksimal 1 atau 2 angka di belakang koma',
      }),
    fat: z
      .number()
      .positive()
      .refine((val) => /^\d+(\.\d{1,2})?$/.test(val.toString()), {
        message:
          'Lemak harus memiliki maksimal 1 atau 2 angka di belakang koma',
      }),
    carbohydrate: z
      .number()
      .positive()
      .refine((val) => /^\d+(\.\d{1,2})?$/.test(val.toString()), {
        message:
          'Karbohidrat harus memiliki maksimal 1 atau 2 angka di belakang koma',
      }),
    fiber: z
      .number()
      .positive()
      .refine((val) => /^\d+(\.\d{1,2})?$/.test(val.toString()), {
        message:
          'Serat harus memiliki maksimal 1 atau 2 angka di belakang koma',
      }),
    sfa: z
      .number()
      .positive()
      .refine((val) => /^\d+(\.\d{1,2})?$/.test(val.toString()), {
        message: 'SFA harus memiliki maksimal 1 atau 2 angka di belakang koma',
      }),
    mufa: z
      .number()
      .positive()
      .refine((val) => /^\d+(\.\d{1,2})?$/.test(val.toString()), {
        message: 'MUFA harus memiliki maksimal 1 atau 2 angka di belakang koma',
      }),
    pufa: z
      .number()
      .positive()
      .refine((val) => /^\d+(\.\d{1,2})?$/.test(val.toString()), {
        message: 'PUFA harus memiliki maksimal 1 atau 2 angka di belakang koma',
      }),
    natrium: z
      .number()
      .positive()
      .refine((val) => /^\d+(\.\d{1,2})?$/.test(val.toString()), {
        message: 'Natrium harus memiliki maksimal 2 angka di belakang koma',
      }),
    cholesterol: z
      .number()
      .positive()
      .refine((val) => /^\d+(\.\d{1,2})?$/.test(val.toString()), {
        message: 'Kolesterol harus memiliki maksimal 2 angka di belakang koma',
      }),
  });

  static readonly UPDATEMENUNUTRITION = z.object({
    restaurant_id: z
      .string()
      .trim()
      .min(38, 'ID restoran tidak valid')
      .max(38, 'ID restoran tidak valid'),
    menu_id: z.number().positive('Menu ID harus bernilai positif'),
    weight_per_portion: z.number().positive().optional(),
    weight_with_bdd: z
      .number()
      .positive('Berat dengan BDD harus bernilai positif')
      .optional(),
    calory: z.number().positive().optional(),
    protein: z
      .number()
      .positive()
      .refine((val) => /^\d+(\.\d{1,2})?$/.test(val.toString()), {
        message:
          'Protein harus memiliki maksimal 1 atau 2 angka di belakang koma',
      })
      .optional(),
    fat: z
      .number()
      .positive()
      .refine((val) => /^\d+(\.\d{1,2})?$/.test(val.toString()), {
        message:
          'Lemak harus memiliki maksimal 1 atau 2 angka di belakang koma',
      })
      .optional(),
    carbohydrate: z
      .number()
      .positive()
      .refine((val) => /^\d+(\.\d{1,2})?$/.test(val.toString()), {
        message:
          'Karbohidrat harus memiliki maksimal 1 atau 2 angka di belakang koma',
      })
      .optional(),
    fiber: z
      .number()
      .positive()
      .refine((val) => /^\d+(\.\d{1,2})?$/.test(val.toString()), {
        message:
          'Serat harus memiliki maksimal 1 atau 2 angka di belakang koma',
      })
      .optional(),
    sfa: z
      .number()
      .positive()
      .refine((val) => /^\d+(\.\d{1,2})?$/.test(val.toString()), {
        message: 'SFA harus memiliki maksimal 1 atau 2 angka di belakang koma',
      })
      .optional(),
    mufa: z
      .number()
      .positive()
      .refine((val) => /^\d+(\.\d{1,2})?$/.test(val.toString()), {
        message: 'MUFA harus memiliki maksimal 1 atau 2 angka di belakang koma',
      })
      .optional(),
    pufa: z
      .number()
      .positive()
      .refine((val) => /^\d+(\.\d{1,2})?$/.test(val.toString()), {
        message: 'PUFA harus memiliki maksimal 1 atau 2 angka di belakang koma',
      })
      .optional(),
    natrium: z
      .number()
      .positive()
      .refine((val) => /^\d+(\.\d{1,2})?$/.test(val.toString()), {
        message: 'Natrium harus memiliki maksimal 2 angka di belakang koma',
      })
      .optional(),
    cholesterol: z
      .number()
      .positive()
      .refine((val) => /^\d+(\.\d{1,2})?$/.test(val.toString()), {
        message: 'Kolesterol harus memiliki maksimal 2 angka di belakang koma',
      })
      .optional(),
  });

  static readonly UPDATEMENUAPPROVAL = z.object({
    restaurant_id: z
      .string()
      .trim()
      .min(38, 'ID restoran tidak valid')
      .max(38, 'ID restoran tidak valid'),
    status: z.enum(['Approved', 'Waiting', 'Rejected'], {
      errorMap: () => ({
        message: "Status harus bernilai 'Approved', 'Waiting', atau 'Rejected'",
      }),
    }),
  });

  static readonly SEARCHMENU = z.object({
    restaurant_id: z
      .string()
      .trim()
      .min(38, 'ID restoran tidak valid')
      .max(38, 'ID restoran tidak valid'),
    name: z.string().trim().min(1, 'Nama tidak boleh kosong').optional(),
    category: z
      .enum(['Makanan Pokok', 'Lauk Pauk', 'Minuman', 'Sayuran', 'Snack'], {
        errorMap: () => ({
          message:
            "Kategori harus bernilai 'Makanan Pokok', 'Lauk Pauk', 'Minuman', 'Sayuran', atau 'Snack'",
        }),
      })
      .optional(),
    price: z
      .enum(['asc', 'desc'], {
        errorMap: () => ({
          message: "Harga harus bernilai 'asc' atau 'desc'",
        }),
      })
      .optional(),
    status: z
      .enum(['Approved', 'Waiting', 'Rejected'], {
        errorMap: () => ({
          message:
            "Status harus bernilai 'Approved', 'Waiting', atau 'Rejected'",
        }),
      })
      .optional(),
  });
}
