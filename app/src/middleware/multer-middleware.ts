import multer from 'multer';
import { ResponseError } from '../error/response-error';

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
        console.log('File received in multer middleware:', file.originalname);
        const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png'];

        // Validasi tipe MIME file
        if (allowedMimeTypes.includes(file.mimetype)) {
            callback(null, true); // Lanjutkan proses upload jika tipe file sesuai
        } else {
            callback(
                new ResponseError(
                    400,
                    'Hanya file dengan format .jpg, .jpeg, dan .png yang diperbolehkan!'
                )
            );
        }
    },
}).single('image'); // Hanya menerima satu file dengan field name 'image'
