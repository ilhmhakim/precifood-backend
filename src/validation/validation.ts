import { z, ZodType } from "zod";

export class Validation {
    static validate<T>(schema: ZodType, data: T, errorType: 'simple' | 'detailed' = 'simple'): T {
        try {
            // Parse data menggunakan schema Zod
            return schema.parse(data);
        } catch (error) {
            // Jika error terjadi, format error berdasarkan tipe yang diminta
            if (error instanceof z.ZodError) {
                if (errorType === 'simple') {
                    // Pesan ringkas untuk pengguna akhir
                    const simpleMessage = error.issues.map(issue => issue.message).join(", ");
                    throw new Error(`Validation Error: ${simpleMessage}`);
                } else if (errorType === 'detailed') {
                    // Pesan lengkap untuk debugging/logging
                    const detailedMessage = `Validation Error: ${JSON.stringify(error, null, 2)}`;
                    throw new Error(detailedMessage);
                }
            }
            // Jika ada error lain yang bukan dari Zod, lemparkan error tersebut
            throw error;
        }
    }
}
