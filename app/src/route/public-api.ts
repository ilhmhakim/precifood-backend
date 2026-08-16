import { Seed } from '../application/seed';
import { SeedMasterBahanBumbu } from '../application/seed-master-bahan-bumbu';
import { AuthController } from '../controller/auth-controller';
import { UserController } from '../controller/user-controller';
import { multerMiddleware } from '../middleware/multer-middleware';
import express from 'express';

export const publicRouter = express.Router();

/**
 * @swagger
 * /api/seeds:
 *   post:
 *     summary: Seed database awal (development only)
 *     tags: [Seed]
 *     responses:
 *       200:
 *         description: Database berhasil di-seed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
publicRouter.post('/api/seeds', Seed);

/**
 * @swagger
 * /api/seeds/master-bahan-bumbu:
 *   post:
 *     summary: Seed master bahan dan bumbu (development only)
 *     tags: [Seed]
 *     responses:
 *       200:
 *         description: Master bahan & bumbu berhasil di-seed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
publicRouter.post('/api/seeds/master-bahan-bumbu', SeedMasterBahanBumbu);

/**
 * @swagger
 * /api/signup/consumer:
 *   post:
 *     summary: Registrasi konsumen baru
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterConsumerRequest'
 *     responses:
 *       201:
 *         description: Registrasi konsumen berhasil
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Validasi input gagal
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
publicRouter.post('/api/signup/consumer', UserController.registerConsumer);

/**
 * @swagger
 * /api/signup/restaurant:
 *   post:
 *     summary: Registrasi restoran baru (dengan upload gambar)
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - phone
 *               - province
 *               - city
 *               - address_detail
 *               - password
 *               - password_confirmation
 *             properties:
 *               name:
 *                 type: string
 *                 maxLength: 255
 *               email:
 *                 type: string
 *                 format: email
 *               phone:
 *                 type: string
 *                 pattern: '^\+?\d{10,20}$'
 *               province:
 *                 type: string
 *                 maxLength: 100
 *               city:
 *                 type: string
 *                 maxLength: 100
 *               address_detail:
 *                 type: string
 *               password:
 *                 type: string
 *                 minLength: 8
 *               password_confirmation:
 *                 type: string
 *                 minLength: 8
 *               image_url:
 *                 type: string
 *                 format: binary
 *                 description: File gambar restoran
 *     responses:
 *       201:
 *         description: Registrasi restoran berhasil
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Validasi input atau file gagal
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
publicRouter.post(
  '/api/signup/restaurant',
  multerMiddleware,
  UserController.registerRestaurant
);

/**
 * @swagger
 * /api/list/restaurant:
 *   get:
 *     summary: Mendapatkan daftar semua restoran (public)
 *     tags: [User]
 *     responses:
 *       200:
 *         description: Daftar restoran berhasil diambil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/RestaurantPublic'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
publicRouter.get('/api/list/restaurant', UserController.getAllRestaurantPublic);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user (Konsumen, Restoran, atau Admin)
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       201:
 *         description: Login berhasil, mengembalikan access_token dan refresh_token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       400:
 *         description: Validasi input gagal
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Email atau password salah
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
publicRouter.post('/api/auth/login', AuthController.login);

/**
 * @swagger
 * /api/auth/refreshtoken:
 *   post:
 *     summary: Refresh access token menggunakan refresh token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RefreshTokenRequest'
 *     responses:
 *       201:
 *         description: Token berhasil di-refresh
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RefreshTokenResponse'
 *       400:
 *         description: Validasi input gagal
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Refresh token tidak valid atau kadaluarsa
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
publicRouter.post('/api/auth/refreshtoken', AuthController.refreshToken);
