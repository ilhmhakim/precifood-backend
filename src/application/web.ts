import express from "express";
import {publicRouter} from "../route/public-api";
import {errorMiddleware} from "../middleware/error-middleware";
import cors from "cors";
import bodyParser from "body-parser";
import {multerMiddleware} from "../middleware/image-uploader-middleware";
import {privateRouter} from "../route/private-api";

export const web = express();
web.disable('x-powered-by');
web.use(cors());
web.use(express.json());
// web.use(express.urlencoded({ extended: false }));
// web.use(multerMiddleware.single('file'));
web.use(publicRouter);
web.use(privateRouter);
web.use(errorMiddleware);