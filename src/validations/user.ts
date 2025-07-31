import { z } from "zod";

const UserSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Panjang nama minimal 1 karakter")
    .max(255, "Panjang nama maksimal 255 karakter"),
  email: z.string().trim().email("Format email tidak valid"),
  new_email: z.string().trim().email("Format email tidak valid"),
  sex: z.enum(["Laki-laki", "Perempuan"], {
    errorMap: () => ({
      message: "Jenis kelamin harus 'Laki-laki' atau 'Perempuan'",
    }),
  }),
  birth: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Format tanggal lahir harus yyyy-mm-dd")
    .refine(
      (date: string) => !isNaN(Date.parse(date)),
      "Tanggal lahir tidak valid",
    ),
  phone: z
    .string()
    .trim()
    .min(1, "Nomor telepon minimal 1 karakter")
    .max(20, "Nomor telepon maksimal 20 karakter")
    .regex(
      /^\+?\d{10,20}$/,
      "Nomor telepon harus berupa angka dan boleh diawali dengan '+'",
    ),
  height: z.number().positive("Tinggi badan harus bernilai positif"),
  weight: z.number().positive("Berat badan harus bernilai positif"),
  medical_history: z.enum(
    ["no_history", "diabetes", "cardiovascular", "hypertension"],
    {
      errorMap: () => ({
        message:
          "Riwayat penyakit harus 'Tidak Ada', 'Diabetes', 'Jantung Koroner/Kolesterol', atau 'Hipertensi'",
      }),
    },
  ),
  password: z.string().trim().min(8, "Password minimal 8 karakter tanpa spasi"),
  old_password: z
    .string()
    .trim()
    .min(8, "Password lama minimal 8 karakter tanpa spasi"),
  new_password: z
    .string()
    .trim()
    .min(8, "Password baru minimal 8 karakter tanpa spasi"),
  password_confirmation: z
    .string()
    .trim()
    .min(8, "Password konfirmasi minimal 8 karakter tanpa spasi"),
});

export default UserSchema;
