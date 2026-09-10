import { storage as gc } from '../config/cloud-storage';
import { ResponseError } from '../error/response-error';
import { format } from 'util';

const bucket = gc.bucket('precifood-image'); // Sesuaikan dengan nama bucket Anda

const JPEG_MAGIC = [0xff, 0xd8, 0xff];
const PNG_MAGIC = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];

function hasMagicBytes(buffer: Buffer, magic: number[]): boolean {
  if (!buffer || buffer.length < magic.length) return false;
  return magic.every((byte, i) => buffer[i] === byte);
}

export class ImageUploaderService {
  static async uploadImage(
    image: Express.Multer.File | undefined,
    folder: string
  ): Promise<string> {
    // Check if a file is provided
    if (!image) {
      throw new ResponseError(400, 'Tidak ada file yang diupload');
    }

    // verify file content (magic bytes), not the
    // client-supplied mimetype/extension. Rejects .exe renamed to .png.
    const isJpeg = hasMagicBytes(image.buffer, JPEG_MAGIC);
    const isPng = hasMagicBytes(image.buffer, PNG_MAGIC);
    if (!isJpeg && !isPng) {
      throw new ResponseError(
        400,
        'File bukan gambar yang valid. Hanya file .jpg/.jpeg/.png yang diperbolehkan'
      );
    }

    return new Promise((resolve, reject) => {
      const { originalname, buffer } = image;

      // Tambahkan timestamp ke nama file untuk membuatnya unik
      const timestamp = Date.now();
      const uniqueFileName = `${folder}/${timestamp}_${originalname.replace(/ /g, '_')}`;

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
        reject(
          new ResponseError(
            500,
            `Unable to upload image, something went wrong: ${err.message}`
          )
        );
      });

      blobStream.end(buffer);
    });
  }
}
