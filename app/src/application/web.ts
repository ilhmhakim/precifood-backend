import { errorMiddleware } from '../middleware/error-middleware';
import { privateRouter } from '../route/private-api';
import { publicRouter } from '../route/public-api';
import cors from 'cors';
import express from 'express';

export const web = express();

web.disable('x-powered-by');
web.use(cors());
web.use(express.json()); // Memproses JSON
web.use(express.urlencoded({ extended: false })); // Memproses URL-encoded data
web.use(publicRouter);
web.use(privateRouter);
web.use(errorMiddleware);
