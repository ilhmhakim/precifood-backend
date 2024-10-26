import express from "express";
import {UserController} from "../controller/user-controller";
import {AuthController} from "../controller/auth-controller";
import {Seed} from "../application/seed";

export const publicRouter = express.Router();
publicRouter.post("/api/seeds", Seed)
// User Module
publicRouter.post("/api/signup/consumer", UserController.registerConsumer);
publicRouter.post("/api/signup/restaurant", UserController.registerRestaurant);
publicRouter.post("/api/signup/admin", UserController.registerAdmin);
// Auth Module
publicRouter.post("/api/auth/login", AuthController.login);
publicRouter.post("/api/auth/refreshtoken",  AuthController.refreshToken);