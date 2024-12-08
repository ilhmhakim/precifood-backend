import { format } from 'util';
import { storage as gc } from '../config/cloud-storage';
import { ResponseError } from '../error/response-error';

const bucket = gc.bucket('precifood-image'); // Sesuaikan dengan nama bucket Anda

export class ImageUploaderService {
    static async uploadImage(image: Express.Multer.File | undefined, folder: string): Promise<string> {
        // Check if a file is provided
        if (!image) {
            throw new ResponseError(400, "Tidak ada file yang diupload");
        }

        return new Promise((resolve, reject) => {
            const { originalname, buffer } = image;

            // Tambahkan timestamp ke nama file untuk membuatnya unik
            const timestamp = Date.now();
            const uniqueFileName = `${folder}/${timestamp}_${originalname.replace(/ /g, "_")}`;

            // Menentukan path file di dalam bucket, menggunakan nama file yang unik
            const blob = bucket.file(uniqueFileName);
            const blobStream = blob.createWriteStream({
                resumable: false,
            });

            blobStream.on('finish', () => {
                const publicUrl = format(
                    `https://storage.googleapis.com/${bucket.name}/${blob.name}`
                );
                resolve(publicUrl);
            });

            blobStream.on('error', (err: Error) => {
                reject(new ResponseError(500, `Unable to upload image, something went wrong: ${err.message}`));
            });

            blobStream.end(buffer);
        });
    }
}
