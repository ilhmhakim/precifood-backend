import express from "express";
import {UserController} from "../controller/user-controller";
import {AuthController} from "../controller/auth-controller";

export const publicRouter = express.Router();
publicRouter.post("/api/signup/consumer", UserController.registerConsumer);
publicRouter.post("/api/signup/restaurant", UserController.registerRestaurant);
publicRouter.post("/api/signup/admin", UserController.registerAdmin);
publicRouter.post("/api/auth/login", AuthController.login);