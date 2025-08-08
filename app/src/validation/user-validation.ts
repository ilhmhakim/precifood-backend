import { z, ZodType } from 'zod';

export class UserValidation {
    static readonly REGISTERCONSUMER: ZodType = z.object({
        name: z
            .string()
            .trim()
            .min(1, 'Panjang nama minimal 1 karakter')
            .max(255, 'Panjang nama maksimal 255 karakter'),
        email: z.string().trim().email({ message: 'Format email tidak valid' }),
        sex: z.enum(['Laki-laki', 'Perempuan'], {
            errorMap: () => ({
                message: "Jenis kelamin harus 'Laki-laki' atau 'Perempuan'",
            }),
        }),
        birth: z
            .string()
            .regex(
                /^\d{4}-\d{2}-\d{2}$/,
                'Format tanggal lahir harus yyyy-mm-dd'
            )
            .refine(
                (date) => !isNaN(Date.parse(date)),
                'Tanggal lahir tidak valid'
            ),
        phone: z
            .string()
            .trim()
            .min(1, 'Nomor telepon minimal 1 karakter')
            .max(20, 'Nomor telepon maksimal 20 karakter')
            .regex(
                /^\+?\d{10,20}$/,
                "Nomor telepon harus berupa angka dan boleh diawali dengan '+'"
            ),
        height: z.number().positive('Tinggi badan harus bernilai positif'),
        weight: z.number().positive('Berat badan harus bernilai positif'),
        medical_history: z.enum(
            ['no_history', 'diabetes', 'cardiovascular', 'hypertension'],
            {
                errorMap: () => ({
                    message:
                        "Riwayat penyakit yang bisa diisi hanya 'no_history', 'diabetes', 'cardiovascular', 'hypertension'",
                }),
            }
        ),
        password: z
            .string()
            .trim()
            .min(8, 'Password minimal 8 karakter tanpa spasi'),
        password_confirmation: z
            .string()
            .trim()
            .min(8, 'Password konfirmasi minimal 8 karakter tanpa spasi'),
    });

    static readonly REGISTERRESTAURANT: ZodType = z.object({
        name: z
            .string()
            .trim()
            .min(1, 'Panjang nama minimal 1 karakter')
            .max(255, 'Panjang nama maksimal 255 karakter'),
        email: z.string().trim().email('Format email tidak valid'),
        phone: z
            .string()
            .trim()
            .min(1, 'Nomor telepon minimal 1 karakter')
            .max(20, 'Nomor telepon maksimal 20 karakter')
            .regex(
                /^\+?\d{10,20}$/,
                "Nomor telepon harus berupa angka dan boleh diawali dengan '+'"
            ),
        province: z
            .string()
            .trim()
            .min(1, 'Panjang nama provinsi minimal 1 karakter')
            .max(100, 'Panjang nama provinsi maksimal 100 karakter'),
        city: z
            .string()
            .trim()
            .min(1, 'Panjang nama kota minimal 1 karakter')
            .max(100, 'Panjang nama kota maksimal 100 karakter'),
        address_detail: z
            .string()
            .trim()
            .min(1, 'Detail alamat minimal 1 karakter'),
        image_url: z.string().trim().min(1, 'URL gambar tidak boleh kosong'),
        password: z.string().trim().min(8, 'Password minimal 8 karakter'),
        password_confirmation: z
            .string()
            .trim()
            .min(8, 'Password konfirmasi minimal 8 karakter'),
    });

    static readonly GETUSERPROFILE: ZodType = z.object({
        id: z
            .string()
            .trim()
            .min(38, 'ID tidak valid')
            .max(38, 'ID tidak valid'),
    });

    static readonly UPDATECONSUMER: ZodType = z.object({
        id: z
            .string()
            .trim()
            .min(38, 'ID tidak valid')
            .max(38, 'ID tidak valid'),
        name: z
            .string()
            .trim()
            .min(1, 'Panjang nama minimal 1 karakter')
            .max(255, 'Panjang nama maksimal 255 karakter')
            .optional(),
        email: z.string().trim().email('Format email tidak valid').optional(),
        sex: z
            .enum(['Laki-laki', 'Perempuan'], {
                errorMap: () => ({
                    message: "Jenis kelamin harus 'Laki-laki' atau 'Perempuan'",
                }),
            })
            .optional(),
        birth: z
            .string()
            .trim()
            .regex(
                /^\d{4}-\d{2}-\d{2}$/,
                'Format tanggal lahir harus yyyy-mm-dd'
            )
            .refine(
                (date) => !isNaN(Date.parse(date)),
                'Tanggal lahir tidak valid'
            )
            .optional(),
        phone: z
            .string()
            .trim()
            .min(1, 'Nomor telepon minimal 1 karakter')
            .max(20, 'Nomor telepon maksimal 20 karakter')
            .regex(
                /^\+?\d{10,20}$/,
                "Nomor telepon harus berupa angka dan boleh diawali dengan '+'"
            )
            .optional(),
        height: z
            .number()
            .positive('Tinggi badan harus bernilai positif')
            .optional(),
        weight: z
            .number()
            .positive('Berat badan harus bernilai positif')
            .optional(),
        medical_history: z
            .enum(
                ['no_history', 'diabetes', 'cardiovascular', 'hypertension'],
                {
                    errorMap: () => ({
                        message:
                            "Riwayat penyakit yang bisa diisi hanya 'no_history', 'diabetes', 'cardiovascular', 'hypertension'",
                    }),
                }
            )
            .optional(),
    });

    static readonly UPDATERESTAURANT: ZodType = z.object({
        id: z
            .string()
            .trim()
            .min(38, 'ID tidak valid')
            .max(38, 'ID tidak valid'),
        name: z
            .string()
            .trim()
            .min(1, 'Panjang nama minimal 1 karakter')
            .max(255, 'Panjang nama maksimal 255 karakter')
            .optional(),
        email: z.string().trim().email('Format email tidak valid').optional(),
        phone: z
            .string()
            .trim()
            .min(1, 'Nomor telepon minimal 1 karakter')
            .max(20, 'Nomor telepon maksimal 20 karakter')
            .regex(
                /^\+?\d{10,20}$/,
                "Nomor telepon harus berupa angka dan boleh diawali dengan '+'"
            )
            .optional(),
        province: z
            .string()
            .trim()
            .min(1, 'Panjang nama provinsi minimal 1 karakter')
            .max(100, 'Panjang nama provinsi maksimal 100 karakter')
            .optional(),
        city: z
            .string()
            .trim()
            .min(1, 'Panjang nama kota minimal 1 karakter')
            .max(100, 'Panjang nama kota maksimal 100 karakter')
            .optional(),
        address_detail: z
            .string()
            .trim()
            .min(1, 'Detail alamat minimal 1 karakter')
            .optional(),
        image_url: z
            .string()
            .trim()
            .min(1, 'URL gambar tidak boleh kosong')
            .optional(),
    });
}
