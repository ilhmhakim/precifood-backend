import { Storage } from '@google-cloud/storage';
import { format } from 'util';

// Inisialisasi Google Cloud Storage
import gc from '../config';
const bucket = gc.bucket('precifood-image-bucket'); // Ganti dengan nama bucket Anda

export class ImageUploaderService {
    static async uploadImage(image: Express.Multer.File): Promise<string> {
        return new Promise((resolve, reject) => {
            const { originalname, buffer } = image;

            // Membuat nama file tanpa spasi
            const blob = bucket.file(originalname.replace(/ /g, "_"));
            const blobStream = blob.createWriteStream({
                resumable: false, // Upload tanpa resumable
            });

            // Jika upload selesai
            blobStream.on('finish', () => {
                const publicUrl = format(
                    `https://storage.googleapis.com/${bucket.name}/${blob.name}`
                );
                resolve(publicUrl);
            });

            // Jika terjadi error selama upload
            blobStream.on('error', (err: Error) => {
                reject(new Error(`Unable to upload image, something went wrong: ${err.message}`));
            });

            // Upload buffer ke bucket
            blobStream.end(buffer);
        });
    }
}
