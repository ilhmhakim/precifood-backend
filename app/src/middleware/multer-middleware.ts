import { ResponseError } from '../error/response-error';
import multer from 'multer';

const JPEG_MAGIC = [0xff, 0xd8, 0xff];
const PNG_MAGIC = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];

function hasMagicBytes(buffer: Buffer, magic: number[]): boolean {
  if (buffer.length < magic.length) return false;
  return magic.every((byte, i) => buffer[i] === byte);
}

export const multerMiddleware = multer({
  storage: multer.memoryStorage(), // Menyimpan file di memori
  limits: {
    fileSize: 5 * 1024 * 1024, // Batas ukuran file maksimal 5 MB
  },
  fileFilter(
    _,
    file: Express.Multer.File,
    callback: multer.FileFilterCallback
  ) {
    // verify the file content (magic bytes)
    const isJpeg = hasMagicBytes(file.buffer, JPEG_MAGIC);
    const isPng = hasMagicBytes(file.buffer, PNG_MAGIC);

    if (isJpeg || isPng) {
      callback(null, true);
    } else {
      callback(
        new ResponseError(
          400,
          'File bukan gambar yang valid. Hanya file .jpg/.jpeg/.png yang diperbolehkan'
        )
      );
    }
  },
}).single('image'); // Hanya menerima satu file dengan field name 'image'
