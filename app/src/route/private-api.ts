// @ts-nocheck
// note (AghnatHs): ts-nocheck because it has an "No overload matches this call." errors in authorizeMiddleware
// but it works fine in runtime and build, so I just ignore the type checking for now
import { AuthController } from '../controller/auth-controller';
import { MasterBahanController } from '../controller/master-bahan-controller';
import { MasterBahanTypeController } from '../controller/master-bahan-type-controller';
import { MasterBumbuController } from '../controller/master-bumbu-controller';
import { MenuController } from '../controller/menu-controller';
import { NotificationController } from '../controller/notification-controller';
import { OrderController } from '../controller/order-controller';
import { RecommendationController } from '../controller/recommendation-controller';
import { UserController } from '../controller/user-controller';
import { authorizeMiddleware } from '../middleware/auth-middleware';
import { multerMiddleware } from '../middleware/multer-middleware';
import { Roles } from '../type/role';
import express from 'express';

export const privateRouter = express.Router();

// User Module
privateRouter.get(
  '/api/users/consumers',
  authorizeMiddleware(Roles.Admin),
  UserController.getAllUserConsumer
);
privateRouter.get(
  '/api/users/restaurants',
  authorizeMiddleware(Roles.AdminAndConsumer),
  UserController.getAllUserRestaurant
);
privateRouter.get(
  '/api/users/consumers/profile',
  authorizeMiddleware(Roles.Consumer),
  UserController.getProfileConsumer
);
privateRouter.patch(
  '/api/users/consumers/profile',
  authorizeMiddleware(Roles.Consumer),
  UserController.updateConsumer
);
privateRouter.patch(
  '/api/users/restaurants/profile',
  authorizeMiddleware(Roles.Restaurant),
  multerMiddleware,
  UserController.updateRestaurant
);
privateRouter.get(
  '/api/users/restaurants/profile',
  authorizeMiddleware(Roles.Restaurant),
  UserController.getProfileRestaurant
);
privateRouter.get(
  '/api/users/consumers/information',
  authorizeMiddleware(Roles.Consumer),
  UserController.getConsumerInfo
);
privateRouter.get(
  '/api/users/consumers/:consumerId([a-zA-Z0-9_-]+)',
  authorizeMiddleware(Roles.Admin),
  UserController.getProfileConsumer
);
privateRouter.get(
  '/api/users/restaurants/:restaurantId([a-zA-Z0-9_-]+)',
  authorizeMiddleware(Roles.AdminAndConsumer),
  UserController.getProfileRestaurant
);

// Master Bahan Type Module
privateRouter.get(
  '/api/master-bahan-types',
  authorizeMiddleware(Roles.Restaurant),
  MasterBahanTypeController.getAll
);

// Master Bahan Module
privateRouter.post(
  '/api/master-bahan',
  authorizeMiddleware(Roles.Restaurant),
  MasterBahanController.create
);
privateRouter.get(
  '/api/master-bahan',
  authorizeMiddleware(Roles.Restaurant),
  MasterBahanController.getAll
);
privateRouter.get(
  '/api/master-bahan/:id(\\d+)',
  authorizeMiddleware(Roles.Restaurant),
  MasterBahanController.get
);
privateRouter.put(
  '/api/master-bahan/:id(\\d+)',
  authorizeMiddleware(Roles.Restaurant),
  MasterBahanController.update
);
privateRouter.delete(
  '/api/master-bahan/:id(\\d+)',
  authorizeMiddleware(Roles.Restaurant),
  MasterBahanController.delete
);

// Master Bumbu Module
privateRouter.post(
  '/api/master-bumbu',
  authorizeMiddleware(Roles.Restaurant),
  MasterBumbuController.create
);
privateRouter.get(
  '/api/master-bumbu',
  authorizeMiddleware(Roles.Restaurant),
  MasterBumbuController.getAll
);
privateRouter.get(
  '/api/master-bumbu/:id(\\d+)',
  authorizeMiddleware(Roles.Restaurant),
  MasterBumbuController.get
);
privateRouter.put(
  '/api/master-bumbu/:id(\\d+)',
  authorizeMiddleware(Roles.Restaurant),
  MasterBumbuController.update
);
privateRouter.delete(
  '/api/master-bumbu/:id(\\d+)',
  authorizeMiddleware(Roles.Restaurant),
  MasterBumbuController.delete
);

// Menu Module
privateRouter.post(
  '/api/restaurants/menu',
  authorizeMiddleware(Roles.Restaurant),
  multerMiddleware,
  MenuController.createMenu
);
privateRouter.get(
  '/api/restaurants/menus',
  authorizeMiddleware(Roles.Restaurant),
  MenuController.getAllRestaurantMenu
);
privateRouter.get(
  '/api/restaurants/menus/search',
  authorizeMiddleware(Roles.Restaurant),
  MenuController.searchMenu
);
privateRouter.get(
  '/api/restaurants/menus/:menuId(\\d+)',
  authorizeMiddleware(Roles.Restaurant),
  MenuController.getMenuDetail
);
privateRouter.patch(
  '/api/restaurants/menus/:menuId(\\d+)',
  authorizeMiddleware(Roles.Restaurant),
  multerMiddleware,
  MenuController.updateMenu
);
privateRouter.delete(
  '/api/restaurants/menus/:menuId(\\d+)',
  authorizeMiddleware(Roles.Restaurant),
  MenuController.deleteMenu
);
privateRouter.get(
  '/api/restaurants/:restaurantId([a-zA-Z0-9_-]+)/menus',
  authorizeMiddleware(Roles.AdminAndConsumer),
  MenuController.getAllRestaurantMenu
);
privateRouter.get(
  '/api/restaurants/:restaurantId([a-zA-Z0-9_-]+)/menus/search',
  authorizeMiddleware(Roles.AdminAndConsumer),
  MenuController.searchMenu
);
privateRouter.get(
  '/api/restaurants/:restaurantId([a-zA-Z0-9_-]+)/menus/:menuId(\\d+)',
  authorizeMiddleware(Roles.AdminAndConsumer),
  MenuController.getMenuDetail
);
privateRouter.post(
  '/api/restaurants/:restaurantId([a-zA-Z0-9_-]+)/menus/:menuId(\\d+)/nutrition',
  authorizeMiddleware(Roles.Admin),
  MenuController.createMenuNutrition
);
privateRouter.patch(
  '/api/restaurants/:restaurantId([a-zA-Z0-9_-]+)/menus/:menuId(\\d+)/nutrition',
  authorizeMiddleware(Roles.Admin),
  MenuController.updateMenuNutrition
);
privateRouter.put(
  '/api/restaurants/:restaurantId([a-zA-Z0-9_-]+)/menus/:menuId(\\d+)/status',
  authorizeMiddleware(Roles.Admin),
  MenuController.updateMenuApproval
);
privateRouter.put(
  '/api/restaurants/:restaurantId([a-zA-Z0-9_-]+)/menus/:menuId(\\d+)/recipe',
  authorizeMiddleware(Roles.Restaurant),
  MenuController.setMenuRecipe
);
privateRouter.get(
  '/api/restaurants/:restaurantId([a-zA-Z0-9_-]+)/menus/:menuId(\\d+)/recipe',
  authorizeMiddleware(Roles.AdminAndRestaurant),
  MenuController.getMenuRecipe
);

// Order Module
privateRouter.post(
  '/api/consumers/orders/:recommendationId(\\d+)',
  authorizeMiddleware(Roles.Consumer),
  OrderController.createOrder
);
privateRouter.get(
  '/api/consumers/orders',
  authorizeMiddleware(Roles.Consumer),
  OrderController.getAllOrder
);
privateRouter.get(
  '/api/consumers/orders/:orderId(\\d+)',
  authorizeMiddleware(Roles.Consumer),
  OrderController.getOrderDetail
);
privateRouter.put(
  '/api/consumers/orders/:orderId(\\d+)/status',
  authorizeMiddleware(Roles.Consumer),
  OrderController.updateOrderStatus
);
privateRouter.delete(
  '/api/consumers/orders/:orderId(\\d+)',
  authorizeMiddleware(Roles.Consumer),
  OrderController.cancelOrder
);

// Notification Module
privateRouter.get(
  '/api/notifications',
  authorizeMiddleware(Roles.Admin),
  NotificationController.getNotification
);
privateRouter.put(
  '/api/notifications/:notificationId(\\d+)',
  authorizeMiddleware(Roles.Admin),
  NotificationController.updateNotificationRead
);

// Recommendation Module
privateRouter.post(
  '/api/restaurants/:restaurantId([a-zA-Z0-9_-]+)/recommendations',
  authorizeMiddleware(Roles.Consumer),
  RecommendationController.getRecommendationFromModel
);
privateRouter.get(
  '/api/restaurants/:restaurantId([a-zA-Z0-9_-]+)/recommendations',
  authorizeMiddleware(Roles.Consumer),
  RecommendationController.getRecommendation
);
privateRouter.get(
  '/api/restaurants/:restaurantId([a-zA-Z0-9_-]+)/recommendations/:recommendationId(\\d+)',
  authorizeMiddleware(Roles.Consumer),
  RecommendationController.getRecommendationDetail
);

// Auth module
privateRouter.put(
  '/api/auth/email',
  authorizeMiddleware(Roles.All),
  AuthController.updateEmail
);
privateRouter.put(
  '/api/auth/password',
  authorizeMiddleware(Roles.All),
  AuthController.updatePassword
);
privateRouter.delete(
  '/api/auth/logout',
  authorizeMiddleware(Roles.All),
  AuthController.logout
);
