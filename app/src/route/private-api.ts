import express from "express";
import {UserController} from "../controller/user-controller";
import {authorizeMiddleware} from "../middleware/auth-middleware";
import {MenuController} from "../controller/menu-controller";
import {OrderController} from "../controller/order-controller";
import {NotificationController} from "../controller/notification-controller";
import {Roles} from "../type/role";
import {RecommendationController} from "../controller/recommendation-controller";
import {AuthController} from "../controller/auth-controller";
import {multerMiddleware} from "../middleware/multer-middleware";

export const privateRouter = express.Router();

// User Module
// @ts-ignore
privateRouter.get("/api/users/consumers", authorizeMiddleware(Roles.Admin), UserController.getAllUserConsumer);
// @ts-ignore
privateRouter.get("/api/users/restaurants", authorizeMiddleware(Roles.AdminAndConsumer), UserController.getAllUserRestaurant);
// @ts-ignore
privateRouter.get("/api/users/consumers/profile", authorizeMiddleware(Roles.Consumer), UserController.getProfileConsumer);
// @ts-ignore
privateRouter.patch("/api/users/consumers/profile", authorizeMiddleware(Roles.Consumer), UserController.updateConsumer);
// @ts-ignore
privateRouter.patch("/api/users/restaurants/profile", authorizeMiddleware(Roles.Restaurant), multerMiddleware, UserController.updateRestaurant);
// @ts-ignore
privateRouter.get("/api/users/restaurants/profile", authorizeMiddleware(Roles.Restaurant), UserController.getProfileRestaurant);
// @ts-ignore
privateRouter.get("/api/users/consumers/information", authorizeMiddleware(Roles.Consumer), UserController.getConsumerInfo);
// @ts-ignore
privateRouter.get("/api/users/consumers/:consumerId([a-zA-Z0-9_-]+)", authorizeMiddleware(Roles.Admin), UserController.getProfileConsumer);
// @ts-ignore
privateRouter.get("/api/users/restaurants/:restaurantId([a-zA-Z0-9_-]+)", authorizeMiddleware(Roles.AdminAndConsumer), UserController.getProfileRestaurant)



// Menu Module
// @ts-ignore
privateRouter.post("/api/restaurants/menu", authorizeMiddleware(Roles.Restaurant), multerMiddleware, MenuController.createMenu);
// @ts-ignore
privateRouter.get("/api/restaurants/menus", authorizeMiddleware(Roles.Restaurant), MenuController.getAllRestaurantMenu);
// @ts-ignore
privateRouter.get("/api/restaurants/menus/search", authorizeMiddleware(Roles.Restaurant), MenuController.searchMenu);
// @ts-ignore
privateRouter.get("/api/restaurants/menus/:menuId(\\d+)", authorizeMiddleware(Roles.Restaurant), MenuController.getMenuDetail);
// @ts-ignore
privateRouter.patch("/api/restaurants/menus/:menuId(\\d+)", authorizeMiddleware(Roles.Restaurant), multerMiddleware, MenuController.updateMenu);
// @ts-ignore
privateRouter.delete("/api/restaurants/menus/:menuId(\\d+)", authorizeMiddleware(Roles.Restaurant), MenuController.deleteMenu);
// @ts-ignore
privateRouter.get("/api/restaurants/:restaurantId([a-zA-Z0-9_-]+)/menus", authorizeMiddleware(Roles.AdminAndConsumer), MenuController.getAllRestaurantMenu);
// @ts-ignore
privateRouter.get("/api/restaurants/:restaurantId([a-zA-Z0-9_-]+)/menus/search", authorizeMiddleware(Roles.AdminAndConsumer), MenuController.searchMenu);
// @ts-ignore
privateRouter.get("/api/restaurants/:restaurantId([a-zA-Z0-9_-]+)/menus/:menuId(\\d+)", authorizeMiddleware(Roles.AdminAndConsumer), MenuController.getMenuDetail);
// @ts-ignore
privateRouter.post("/api/restaurants/:restaurantId([a-zA-Z0-9_-]+)/menus/:menuId(\\d+)/nutrition", authorizeMiddleware(Roles.Admin), MenuController.createMenuNutrition);
// @ts-ignore
privateRouter.patch("/api/restaurants/:restaurantId([a-zA-Z0-9_-]+)/menus/:menuId(\\d+)/nutrition", authorizeMiddleware(Roles.Admin), MenuController.updateMenuNutrition);
// @ts-ignore
privateRouter.put("/api/restaurants/:restaurantId([a-zA-Z0-9_-]+)/menus/:menuId(\\d+)/status", authorizeMiddleware(Roles.Admin), MenuController.updateMenuApproval);


// Order Module
// @ts-ignore
 privateRouter.post("/api/consumers/orders/:recommendationId(\\d+)", authorizeMiddleware(Roles.Consumer), OrderController.createOrder);
// @ts-ignore
privateRouter.get("/api/consumers/orders", authorizeMiddleware(Roles.Consumer), OrderController.getAllOrder);
// @ts-ignore
privateRouter.get("/api/consumers/orders/:orderId(\\d+)", authorizeMiddleware(Roles.Consumer), OrderController.getOrderDetail);
// @ts-ignore
privateRouter.put("/api/consumers/orders/:orderId(\\d+)/status", authorizeMiddleware(Roles.Consumer), OrderController.updateOrderStatus);
// @ts-ignore
privateRouter.delete("/api/consumers/orders/:orderId(\\d+)", authorizeMiddleware(Roles.Consumer), OrderController.cancelOrder);

// Notification Module
// @ts-ignore
privateRouter.get("/api/notifications", authorizeMiddleware(Roles.Admin), NotificationController.getNotification);
// @ts-ignore
privateRouter.put("/api/notifications/:notificationId(\\d+)", authorizeMiddleware(Roles.Admin), NotificationController.updateNotificationRead);

// Recommendation Module
// @ts-ignore
privateRouter.post("/api/restaurants/:restaurantId([a-zA-Z0-9_-]+)/recommendations", authorizeMiddleware(Roles.Consumer), RecommendationController.getRecommendationFromModel);
// @ts-ignore
privateRouter.get("/api/restaurants/:restaurantId([a-zA-Z0-9_-]+)/recommendations", authorizeMiddleware(Roles.Consumer), RecommendationController.getRecommendation);
// @ts-ignore
privateRouter.get("/api/restaurants/:restaurantId([a-zA-Z0-9_-]+)/recommendations/:recommendationId(\\d+)", authorizeMiddleware(Roles.Consumer), RecommendationController.getRecommendationDetail);

// Auth module
// @ts-ignore
privateRouter.put("/api/auth/email", authorizeMiddleware(Roles.All), AuthController.updateEmail);
// @ts-ignore
privateRouter.put("/api/auth/password", authorizeMiddleware(Roles.All), AuthController.updatePassword);
// @ts-ignore
privateRouter.delete("/api/auth/logout", authorizeMiddleware(Roles.All), AuthController.logout);