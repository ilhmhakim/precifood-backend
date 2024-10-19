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
privateRouter.get("/api/users/consumers", authorizeMiddleware(Roles.Admin), UserController.getAllUserConsumer);
// @ts-ignore
privateRouter.get("/api/users/restaurants", authorizeMiddleware(Roles.Admin), UserController.getAllUserRestaurant);
// @ts-ignore
privateRouter.get("/api/users/consumer/profile", authorizeMiddleware(Roles.Consumer), UserController.getProfileConsumer);4
// @ts-ignore
privateRouter.patch("/api/users/consumer/profile", authorizeMiddleware(Roles.Consumer), UserController.updateConsumer);
// @ts-ignore
privateRouter.patch("/api/users/restaurant/profile", authorizeMiddleware(Roles.Restaurant), UserController.updateConsumer);
// @ts-ignore
privateRouter.get("/api/users/restaurant/profile", authorizeMiddleware(Roles.Restaurant), UserController.getProfileRestaurant);
// @ts-ignore
privateRouter.get("/api/users/consumer/information", authorizeMiddleware(Roles.Consumer), UserController.getConsumerInfo);
// @ts-ignore
privateRouter.get("/api/users/consumer/:consumerId([a-zA-Z0-9_-]+)", authorizeMiddleware(Roles.Admin), UserController.getProfileConsumer);
// @ts-ignore
privateRouter.get("/api/users/restaurant/:restaurantId([a-zA-Z0-9_-]+)", authorizeMiddleware(Roles.AdminAndConsumer), UserController.getProfileRestaurant)



// Menu Module
// @ts-ignore
privateRouter.post("/api/menu", authorizeMiddleware(Roles.Restaurant), MenuController.createMenu);
// @ts-ignore
privateRouter.patch("/api/menu/:menuId(\\d+)", authorizeMiddleware(Roles.Restaurant), MenuController.updateMenu);
// @ts-ignore
privateRouter.delete("/api/menu/:menuId(\\d+)", authorizeMiddleware(Roles.Restaurant), MenuController.deleteMenu);
// @ts-ignore
privateRouter.post("/api/restaurant/:restaurantId([a-zA-Z0-9_-]+)/menu/:menuId(\\d+)/nutrition", authorizeMiddleware(Roles.Admin), MenuController.createMenuNutrition);
// @ts-ignore
privateRouter.patch("/api/restaurant/:restaurantId([a-zA-Z0-9_-]+)/menu/:menuId(\\d+)/nutrition", authorizeMiddleware(Roles.Admin), MenuController.updateMenuNutrition);
// @ts-ignoreRES
privateRouter.patch("/api/restaurant/:restaurantId([a-zA-Z0-9_-]+)/menu/:menuId(\\d+)/status", authorizeMiddleware(Roles.Admin), MenuController.updateMenuApproval);
// get all
// search name
// filter

// Order Module
privateRouter.post("/api/order", OrderController.createOrder);
// get all
// get detail

// Notification Module
// @ts-ignore
privateRouter.get("/api/notifications", NotificationController.getNotification);
// @ts-ignore
privateRouter.patch("/api/notifications/:notificationId(\\d+)", NotificationController.updateNotificationRead);

// Recommendation Module
// get
// get