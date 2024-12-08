import express from "express";
import {UserController} from "../controller/user-controller";
import {AuthController} from "../controller/auth-controller";
import {multerMiddleware} from "../middleware/multer-middleware";
import {Seed} from "../application/seed";

export const publicRouter = express.Router();
publicRouter.post("/api/seeds", Seed)
// User Module
publicRouter.post("/api/signup/consumer", UserController.registerConsumer);
publicRouter.post("/api/signup/restaurant", multerMiddleware, UserController.registerRestaurant);
// Auth Module
publicRouter.post("/api/auth/login", AuthController.login);
publicRouter.post("/api/auth/refreshtoken",  AuthController.refreshToken);