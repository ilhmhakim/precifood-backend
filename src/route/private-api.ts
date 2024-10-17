import express from "express";
import {UserController} from "../controller/user-controller";
import {authorizeMiddleware} from "../middleware/auth-middleware";
import {MenuController} from "../controller/menu-controller";
import {OrderController} from "../controller/order-controller";
import {NotificationController} from "../controller/notification-controller";
import {Roles} from "../type/role";

export const privateRouter = express.Router();


// User Module
// @ts-ignore
privateRouter.get("/api/users/consumer/profile", authorizeMiddleware(Roles.Consumer), UserController.getProfileConsumer);
// @ts-ignore
privateRouter.get("/api/users/consumer/:consumerId([a-zA-Z0-9_-]+)", authorizeMiddleware(Roles.Admin), UserController.getProfileConsumer);
// @ts-ignore
privateRouter.get("api/users/restaurant/profile", authorizeMiddleware(Roles.Restaurant), UserController.getProfileRestaurant)
// @ts-ignore
privateRouter.get("/api/users/restaurant/:restaurantId([a-zA-Z0-9_-]+)", authorizeMiddleware(Roles.AdminAndConsumer), UserController.getProfileRestaurant)




// Menu Module
privateRouter.post("/api/menu", MenuController.createMenu);
privateRouter.put("/api/menu/:menuId(\\d+)", MenuController.updateMenu);
privateRouter.delete("/api/menu/:menuId(\\d+)", MenuController.deleteMenu);
privateRouter.post("/api/menu/:menuId(\\d+)/nutrition", MenuController.createMenuNutrition);
privateRouter.put("/api/menu/:menuId(\\d+)/nutrition", MenuController.updateMenuNutrition);
privateRouter.patch("/api/menu/:menuId(\\d+)/status", MenuController.updateMenuApproval);

// Order Module
privateRouter.post("/api/order", OrderController.createOrder);

// Notification Module
// @ts-ignore
privateRouter.get("/api/notifications", NotificationController.getNotification);
// @ts-ignore
privateRouter.patch("/api/notifications/:notificationId(\\d+)", NotificationController.updateNotificationRead);
