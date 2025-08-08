import { Response, Request, NextFunction } from 'express';
import { ZodError } from 'zod';
import { ResponseError } from '../error/response-error';
import multer from 'multer';

export const errorMiddleware = async (
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (error instanceof ZodError) {
        res.status(400).json({
            errors: error.errors.map((err) => err.message).join(', '),
        });
    } else if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            res.status(400).json({
                errors: 'File terlalu besar! Maksimal ukuran file adalah 5MB.',
            });
        } else {
            res.status(400).json({
                errors: `Kesalahan upload file: ${error.message}`,
            });
        }
    } else if (error instanceof ResponseError) {
        res.status(error.status).json({
            errors: error.message,
        });
    } else {
        res.status(500).json({
            errors: error.message,
        });
    }
};
