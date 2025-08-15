import { z, ZodType } from 'zod';

export class MasterBahanValidation {
  static readonly CREATE: ZodType = z.object({
    name: z
      .string({ required_error: 'Nama bahan harus diisi' })
      .trim()
      .min(1, 'Nama bahan minimal 1 karakter')
      .max(255, 'Nama bahan maksimal 255 karakter'),
    type_id: z
      .number({ required_error: 'ID tipe bahan harus diisi' })
      .int('ID tipe bahan harus berupa bilangan bulat')
      .positive('ID tipe bahan harus bernilai positif'),
    bdd: z
      .number({ required_error: 'BDD harus diisi' })
      .int()
      .min(1, 'BDD harus minimal 1')
      .max(100, 'BDD harus maksimal 100')
      .default(100),
    calory: z
      .number({ required_error: 'Kalori harus diisi' })
      .min(0, 'Kalori tidak boleh negatif')
      .refine((val) => /^\d+(\.\d{1,2})?$/.test(val.toString()), {
        message: 'Kalori harus memiliki maksimal 2 angka di belakang koma',
      }),
    protein: z
      .number({ required_error: 'Protein harus diisi' })
      .min(0, 'Protein tidak boleh negatif')
      .refine((val) => /^\d+(\.\d{1,2})?$/.test(val.toString()), {
        message: 'Protein harus memiliki maksimal 2 angka di belakang koma',
      }),
    fat: z
      .number({ required_error: 'Lemak harus diisi' })
      .min(0, 'Lemak tidak boleh negatif')
      .refine((val) => /^\d+(\.\d{1,2})?$/.test(val.toString()), {
        message: 'Lemak harus memiliki maksimal 2 angka di belakang koma',
      }),
    carbohydrate: z
      .number({ required_error: 'Karbohidrat harus diisi' })
      .min(0, 'Karbohidrat tidak boleh negatif')
      .refine((val) => /^\d+(\.\d{1,2})?$/.test(val.toString()), {
        message: 'Karbohidrat harus memiliki maksimal 2 angka di belakang koma',
      }),
    fiber: z
      .number({ required_error: 'Serat harus diisi' })
      .min(0, 'Serat tidak boleh negatif')
      .refine((val) => /^\d+(\.\d{1,2})?$/.test(val.toString()), {
        message: 'Serat harus memiliki maksimal 2 angka di belakang koma',
      }),
    natrium: z
      .number({ required_error: 'Natrium harus diisi' })
      .min(0, 'Natrium tidak boleh negatif')
      .refine((val) => /^\d+(\.\d{1,2})?$/.test(val.toString()), {
        message: 'Natrium harus memiliki maksimal 2 angka di belakang koma',
      }),
    cholesterol: z
      .number({ required_error: 'Kolesterol harus diisi' })
      .min(0, 'Kolesterol tidak boleh negatif')
      .refine((val) => /^\d+(\.\d{1,2})?$/.test(val.toString()), {
        message: 'Kolesterol harus memiliki maksimal 2 angka di belakang koma',
      }),
    sfa: z
      .number({ required_error: 'SFA harus diisi' })
      .min(0, 'SFA tidak boleh negatif')
      .refine((val) => /^\d+(\.\d{1,2})?$/.test(val.toString()), {
        message: 'SFA harus memiliki maksimal 2 angka di belakang koma',
      }),
    mufa: z
      .number({ required_error: 'MUFA harus diisi' })
      .min(0, 'MUFA tidak boleh negatif')
      .refine((val) => /^\d+(\.\d{1,2})?$/.test(val.toString()), {
        message: 'MUFA harus memiliki maksimal 2 angka di belakang koma',
      }),
    pufa: z
      .number({ required_error: 'PUFA harus diisi' })
      .min(0, 'PUFA tidak boleh negatif')
      .refine((val) => /^\d+(\.\d{1,2})?$/.test(val.toString()), {
        message: 'PUFA harus memiliki maksimal 2 angka di belakang koma',
      }),
  });

  static readonly UPDATE: ZodType = z.object({
    id: z.number().int().positive('ID bahan harus bernilai positif'),
    name: z
      .string()
      .trim()
      .min(1, 'Nama bahan minimal 1 karakter')
      .max(255, 'Nama bahan maksimal 255 karakter')
      .optional(),
    type_id: z
      .number()
      .int('ID tipe bahan harus berupa bilangan bulat')
      .positive('ID tipe bahan harus bernilai positif')
      .optional(),
    bdd: z
      .number()
      .int()
      .min(1, 'BDD harus minimal 1')
      .max(100, 'BDD harus maksimal 100')
      .optional(),
    calory: z
      .number()
      .min(0, 'Kalori tidak boleh negatif')
      .refine((val) => /^\d+(\.\d{1,2})?$/.test(val.toString()), {
        message: 'Kalori harus memiliki maksimal 2 angka di belakang koma',
      })
      .optional(),
    protein: z
      .number()
      .min(0, 'Protein tidak boleh negatif')
      .refine((val) => /^\d+(\.\d{1,2})?$/.test(val.toString()), {
        message: 'Protein harus memiliki maksimal 2 angka di belakang koma',
      })
      .optional(),
    fat: z
      .number()
      .min(0, 'Lemak tidak boleh negatif')
      .refine((val) => /^\d+(\.\d{1,2})?$/.test(val.toString()), {
        message: 'Lemak harus memiliki maksimal 2 angka di belakang koma',
      })
      .optional(),
    carbohydrate: z
      .number()
      .min(0, 'Karbohidrat tidak boleh negatif')
      .refine((val) => /^\d+(\.\d{1,2})?$/.test(val.toString()), {
        message: 'Karbohidrat harus memiliki maksimal 2 angka di belakang koma',
      })
      .optional(),
    fiber: z
      .number()
      .min(0, 'Serat tidak boleh negatif')
      .refine((val) => /^\d+(\.\d{1,2})?$/.test(val.toString()), {
        message: 'Serat harus memiliki maksimal 2 angka di belakang koma',
      })
      .optional(),
    natrium: z
      .number()
      .min(0, 'Natrium tidak boleh negatif')
      .refine((val) => /^\d+(\.\d{1,2})?$/.test(val.toString()), {
        message: 'Natrium harus memiliki maksimal 2 angka di belakang koma',
      })
      .optional(),
    cholesterol: z
      .number()
      .min(0, 'Kolesterol tidak boleh negatif')
      .refine((val) => /^\d+(\.\d{1,2})?$/.test(val.toString()), {
        message: 'Kolesterol harus memiliki maksimal 2 angka di belakang koma',
      })
      .optional(),
    sfa: z
      .number()
      .min(0, 'SFA tidak boleh negatif')
      .refine((val) => /^\d+(\.\d{1,2})?$/.test(val.toString()), {
        message: 'SFA harus memiliki maksimal 2 angka di belakang koma',
      })
      .optional(),
    mufa: z
      .number()
      .min(0, 'MUFA tidak boleh negatif')
      .refine((val) => /^\d+(\.\d{1,2})?$/.test(val.toString()), {
        message: 'MUFA harus memiliki maksimal 2 angka di belakang koma',
      })
      .optional(),
    pufa: z
      .number()
      .min(0, 'PUFA tidak boleh negatif')
      .refine((val) => /^\d+(\.\d{1,2})?$/.test(val.toString()), {
        message: 'PUFA harus memiliki maksimal 2 angka di belakang koma',
      })
      .optional(),
  });

  static readonly GET: ZodType = z.object({
    id: z.number().int().positive('ID bahan harus bernilai positif'),
  });

  static readonly DELETE: ZodType = z.object({
    id: z.number().int().positive('ID bahan harus bernilai positif'),
  });
}
