import { z, ZodType } from 'zod';

export class AuthValidation {
  static readonly LOGIN: ZodType = z.object({
    email: z.string().trim().email('Format email tidak valid'),
    password: z
      .string()
      .trim()
      .min(8, 'Password minimal 8 karakter tanpa spasi'),
  });

  static readonly REFRESH: ZodType = z.object({
    refresh_token: z.string().trim().min(1, 'Refresh token tidak boleh kosong'),
  });

  static readonly UPDATEEMAIL: ZodType = z.object({
    user_id: z
      .string()
      .trim()
      .min(38, 'ID tidak valid')
      .max(38, 'ID tidak valid'),
    new_email: z.string().trim().email('Format email tidak valid'),
    password: z
      .string()
      .trim()
      .min(8, 'Password minimal 8 karakter tanpa spasi'),
  });

  static readonly UPDATEPASSWORD: ZodType = z.object({
    user_id: z
      .string()
      .trim()
      .min(38, 'ID tidak valid')
      .max(38, 'ID tidak valid'),
    old_password: z
      .string()
      .trim()
      .min(8, 'Password minimal 8 karakter tanpa spasi'),
    new_password: z
      .string()
      .trim()
      .min(8, 'Password baru minimal 8 karakter tanpa spasi'),
    password_confirmation: z
      .string()
      .trim()
      .min(8, 'Password konfirmasi minimal 8 karakter tanpa spasi'),
  });
}
