import { Seed } from '../application/seed';
import { SeedMasterBahanBumbu } from '../application/seed-master-bahan-bumbu';
import { AuthController } from '../controller/auth-controller';
import { UserController } from '../controller/user-controller';
import { multerMiddleware } from '../middleware/multer-middleware';
import express from 'express';

export const publicRouter = express.Router();
publicRouter.post('/api/seeds', Seed);
publicRouter.post('/api/seeds/master-bahan-bumbu', SeedMasterBahanBumbu);
// User Module
publicRouter.post('/api/signup/consumer', UserController.registerConsumer);
publicRouter.post(
  '/api/signup/restaurant',
  multerMiddleware,
  UserController.registerRestaurant
);
publicRouter.get('/api/list/restaurant', UserController.getAllRestaurantPublic);
// Auth Module
publicRouter.post('/api/auth/login', AuthController.login);
publicRouter.post('/api/auth/refreshtoken', AuthController.refreshToken);
