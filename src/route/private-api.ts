import express from "express";
import {UserController} from "../controller/user-controller";
import {authorizeMiddleware, Roles} from "../middleware/auth-middleware";
import {MenuController} from "../controller/menu-controller";

export const privateRouter = express.Router();


// Consumer
// privateRouter.get("/api/users/consumer/profile", authorizeMiddleware(Roles.Consumer), UserController.getProfile);


// Menu Module
privateRouter.post("/api/menu", MenuController.createMenu)
privateRouter.put("/api/menu/:menuId(\\d+)", MenuController.updateMenu)
privateRouter.delete("/api/menu/:menuId(\\d+)", MenuController.deleteMenu)
privateRouter.post("/api/menu/:menuId(\\d+)/nutrition", MenuController.createMenuNutrition)