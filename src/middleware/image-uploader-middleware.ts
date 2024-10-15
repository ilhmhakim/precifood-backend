import multer from 'multer';
import {ResponseError} from "../error/response-error";

export const multerMiddleware = multer({
    storage: multer.memoryStorage(), // File disimpan di memori
    limits: {
        fileSize: 5 * 1024 * 1024, // Ukuran file maksimal 5MB\

    },
    fileFilter(_, file: Express.Multer.File, callback: multer.FileFilterCallback) {
        // Validasi mime type dan ekstensi file
        const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png'];

        if (allowedMimeTypes.includes(file.mimetype)) {
            // Jika format file sesuai, lanjutkan upload
            callback(null, true);
        } else {
            // Jika format file tidak sesuai, tolak upload
            callback(new ResponseError(400, 'Hanya fie dengan format .jpg, .jpeg, dan .png yang diperbolehkan!'));
        }
    },
});


