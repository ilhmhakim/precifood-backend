import { logger } from '../application/logging';
import { ResponseError } from '../error/response-error';
import { NextFunction, Request, Response } from 'express';
import multer from 'multer';
import { ZodError } from 'zod';

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
    // full error stays server-side only; client gets generic 500
    // so stack traces / DB identity can never leak in responses.
    logger.error({
      method: req.method,
      path: req.path,
      error: error instanceof Error ? (error.stack ?? error.message) : error,
    });
    res.status(500).json({
      errors: 'Terjadi kesalahan pada server',
    });
  }
};
