import { ResponseError } from '../error/response-error';
import multer from 'multer';

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
    // Cheap first gate on the client-supplied mimetype. The real content
    // check (magic bytes) runs in ImageUploaderService, because multer calls
    // fileFilter BEFORE the file buffer is available.
    const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png'];

    if (allowedMimeTypes.includes(file.mimetype)) {
      callback(null, true); // Lanjutkan proses upload jika tipe file sesuai
    } else {
      callback(
        new ResponseError(
          400,
          'Hanya file dengan format .jpg, .jpeg, dan .png yang diperbolehkan'
        )
      );
    }
  },
}).single('image'); // Hanya menerima satu file dengan field name 'image'
