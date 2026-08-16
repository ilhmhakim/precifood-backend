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

/**
 * @swagger
 * /api/users/consumers:
 *   get:
 *     summary: Mendapatkan daftar semua konsumen
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Daftar konsumen berhasil diambil
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
 *                     $ref: '#/components/schemas/UserSummary'
 *       401:
 *         description: Token tidak valid atau kadaluarsa
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Role tidak diizinkan
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
privateRouter.get(
  '/api/users/consumers',
  authorizeMiddleware(Roles.Admin),
  UserController.getAllUserConsumer
);

/**
 * @swagger
 * /api/users/restaurants:
 *   get:
 *     summary: Mendapatkan daftar semua restoran
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
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
 *                     $ref: '#/components/schemas/UserSummary'
 *       401:
 *         description: Token tidak valid atau kadaluarsa
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Role tidak diizinkan
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
privateRouter.get(
  '/api/users/restaurants',
  authorizeMiddleware(Roles.AdminAndConsumer),
  UserController.getAllUserRestaurant
);

/**
 * @swagger
 * /api/users/consumers/profile:
 *   get:
 *     summary: Mendapatkan profil konsumen yang sedang login
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profil konsumen berhasil diambil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/ConsumerProfile'
 *       401:
 *         description: Token tidak valid atau kadaluarsa
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Role tidak diizinkan
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
privateRouter.get(
  '/api/users/consumers/profile',
  authorizeMiddleware(Roles.Consumer),
  UserController.getProfileConsumer
);

/**
 * @swagger
 * /api/users/consumers/profile:
 *   patch:
 *     summary: Memperbarui profil konsumen yang sedang login
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateConsumerRequest'
 *     responses:
 *       200:
 *         description: Profil konsumen berhasil diperbarui
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/ConsumerProfile'
 *       400:
 *         description: Data yang dikirim tidak valid
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Token tidak valid atau kadaluarsa
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Role tidak diizinkan
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
privateRouter.patch(
  '/api/users/consumers/profile',
  authorizeMiddleware(Roles.Consumer),
  UserController.updateConsumer
);

/**
 * @swagger
 * /api/users/restaurants/profile:
 *   patch:
 *     summary: Memperbarui profil restoran yang sedang login (termasuk foto profil)
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/UpdateRestaurantRequest'
 *     responses:
 *       200:
 *         description: Profil restoran berhasil diperbarui
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/RestaurantProfile'
 *       400:
 *         description: Data yang dikirim tidak valid
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Token tidak valid atau kadaluarsa
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Role tidak diizinkan
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
privateRouter.patch(
  '/api/users/restaurants/profile',
  authorizeMiddleware(Roles.Restaurant),
  multerMiddleware,
  UserController.updateRestaurant
);

/**
 * @swagger
 * /api/users/restaurants/profile:
 *   get:
 *     summary: Mendapatkan profil restoran yang sedang login
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profil restoran berhasil diambil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/RestaurantProfile'
 *       401:
 *         description: Token tidak valid atau kadaluarsa
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Role tidak diizinkan
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
privateRouter.get(
  '/api/users/restaurants/profile',
  authorizeMiddleware(Roles.Restaurant),
  UserController.getProfileRestaurant
);

/**
 * @swagger
 * /api/users/consumers/information:
 *   get:
 *     summary: Mendapatkan informasi konsumen yang sedang login
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Informasi konsumen berhasil diambil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/ConsumerInfo'
 *       401:
 *         description: Token tidak valid atau kadaluarsa
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Role tidak diizinkan
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
privateRouter.get(
  '/api/users/consumers/information',
  authorizeMiddleware(Roles.Consumer),
  UserController.getConsumerInfo
);

/**
 * @swagger
 * /api/users/consumers/{consumerId}:
 *   get:
 *     summary: Mendapatkan profil konsumen berdasarkan ID
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: consumerId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID konsumen (UUID)
 *     responses:
 *       200:
 *         description: Profil konsumen berhasil diambil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/ConsumerProfile'
 *       401:
 *         description: Token tidak valid atau kadaluarsa
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Role tidak diizinkan
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Konsumen tidak ditemukan
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
privateRouter.get(
  '/api/users/consumers/:consumerId([a-zA-Z0-9_-]+)',
  authorizeMiddleware(Roles.Admin),
  UserController.getProfileConsumer
);

/**
 * @swagger
 * /api/users/restaurants/{restaurantId}:
 *   get:
 *     summary: Mendapatkan profil restoran berdasarkan ID
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: restaurantId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID restoran (UUID)
 *     responses:
 *       200:
 *         description: Profil restoran berhasil diambil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/RestaurantProfile'
 *       401:
 *         description: Token tidak valid atau kadaluarsa
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Role tidak diizinkan
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Restoran tidak ditemukan
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
privateRouter.get(
  '/api/users/restaurants/:restaurantId([a-zA-Z0-9_-]+)',
  authorizeMiddleware(Roles.AdminAndConsumer),
  UserController.getProfileRestaurant
);

// Master Bahan Type Module

/**
 * @swagger
 * /api/master-bahan-types:
 *   get:
 *     summary: Mendapatkan daftar semua tipe master bahan
 *     tags: [Master Bahan Type]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Daftar tipe master bahan berhasil diambil
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
 *                     $ref: '#/components/schemas/MasterBahanType'
 *       401:
 *         description: Token tidak valid atau kadaluarsa
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Role tidak diizinkan
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
privateRouter.get(
  '/api/master-bahan-types',
  authorizeMiddleware(Roles.AdminAndRestaurant),
  MasterBahanTypeController.getAll
);

// Master Bahan Module

/**
 * @swagger
 * /api/master-bahan:
 *   post:
 *     summary: Membuat master bahan baru
 *     tags: [Master Bahan]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MasterBahanCreateRequest'
 *     responses:
 *       201:
 *         description: Master bahan berhasil dibuat
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/MasterBahan'
 *       400:
 *         description: Data yang dikirim tidak valid
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Token tidak valid atau kadaluarsa
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Role tidak diizinkan
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
privateRouter.post(
  '/api/master-bahan',
  authorizeMiddleware(Roles.AdminAndRestaurant),
  MasterBahanController.create
);

/**
 * @swagger
 * /api/master-bahan:
 *   get:
 *     summary: Mendapatkan daftar semua master bahan
 *     tags: [Master Bahan]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Daftar master bahan berhasil diambil
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
 *                     $ref: '#/components/schemas/MasterBahan'
 *       401:
 *         description: Token tidak valid atau kadaluarsa
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Role tidak diizinkan
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
privateRouter.get(
  '/api/master-bahan',
  authorizeMiddleware(Roles.AdminAndRestaurant),
  MasterBahanController.getAll
);

/**
 * @swagger
 * /api/master-bahan/{id}:
 *   get:
 *     summary: Mendapatkan detail master bahan berdasarkan ID
 *     tags: [Master Bahan]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID master bahan
 *     responses:
 *       200:
 *         description: Detail master bahan berhasil diambil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/MasterBahan'
 *       401:
 *         description: Token tidak valid atau kadaluarsa
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Role tidak diizinkan
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Master bahan tidak ditemukan
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
privateRouter.get(
  '/api/master-bahan/:id(\\d+)',
  authorizeMiddleware(Roles.AdminAndRestaurant),
  MasterBahanController.get
);

/**
 * @swagger
 * /api/master-bahan/{id}:
 *   put:
 *     summary: Memperbarui master bahan berdasarkan ID
 *     tags: [Master Bahan]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID master bahan
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MasterBahanUpdateRequest'
 *     responses:
 *       200:
 *         description: Master bahan berhasil diperbarui
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/MasterBahan'
 *       400:
 *         description: Data yang dikirim tidak valid
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Token tidak valid atau kadaluarsa
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Role tidak diizinkan
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Master bahan tidak ditemukan
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
privateRouter.put(
  '/api/master-bahan/:id(\\d+)',
  authorizeMiddleware(Roles.AdminAndRestaurant),
  MasterBahanController.update
);

/**
 * @swagger
 * /api/master-bahan/{id}:
 *   delete:
 *     summary: Menghapus master bahan berdasarkan ID
 *     tags: [Master Bahan]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID master bahan
 *     responses:
 *       200:
 *         description: Master bahan berhasil dihapus
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       401:
 *         description: Token tidak valid atau kadaluarsa
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Role tidak diizinkan
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Master bahan tidak ditemukan
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
privateRouter.delete(
  '/api/master-bahan/:id(\\d+)',
  authorizeMiddleware(Roles.AdminAndRestaurant),
  MasterBahanController.delete
);

/**
 * @swagger
 * /api/master-bahan/{id}/status:
 *   post:
 *     summary: Memperbarui status persetujuan master bahan (Admin)
 *     tags: [Master Bahan]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID master bahan
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ApprovalStatusRequest'
 *     responses:
 *       200:
 *         description: Status master bahan berhasil diperbarui
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Data yang dikirim tidak valid
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Token tidak valid atau kadaluarsa
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Role tidak diizinkan
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Master bahan tidak ditemukan
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
privateRouter.post(
  '/api/master-bahan/:id(\\d+)/status',
  authorizeMiddleware(Roles.Admin),
  MasterBahanController.updateBahanApproval
);

// Master Bumbu Module

/**
 * @swagger
 * /api/master-bumbu:
 *   post:
 *     summary: Membuat master bumbu baru
 *     tags: [Master Bumbu]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MasterBumbuCreateRequest'
 *     responses:
 *       201:
 *         description: Master bumbu berhasil dibuat
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/MasterBumbu'
 *       400:
 *         description: Data yang dikirim tidak valid
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Token tidak valid atau kadaluarsa
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Role tidak diizinkan
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
privateRouter.post(
  '/api/master-bumbu',
  authorizeMiddleware(Roles.AdminAndRestaurant),
  MasterBumbuController.create
);

/**
 * @swagger
 * /api/master-bumbu:
 *   get:
 *     summary: Mendapatkan daftar semua master bumbu
 *     tags: [Master Bumbu]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Daftar master bumbu berhasil diambil
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
 *                     $ref: '#/components/schemas/MasterBumbu'
 *       401:
 *         description: Token tidak valid atau kadaluarsa
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Role tidak diizinkan
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
privateRouter.get(
  '/api/master-bumbu',
  authorizeMiddleware(Roles.AdminAndRestaurant),
  MasterBumbuController.getAll
);

/**
 * @swagger
 * /api/master-bumbu/{id}:
 *   get:
 *     summary: Mendapatkan detail master bumbu berdasarkan ID
 *     tags: [Master Bumbu]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID master bumbu
 *     responses:
 *       200:
 *         description: Detail master bumbu berhasil diambil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/MasterBumbu'
 *       401:
 *         description: Token tidak valid atau kadaluarsa
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Role tidak diizinkan
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Master bumbu tidak ditemukan
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
privateRouter.get(
  '/api/master-bumbu/:id(\\d+)',
  authorizeMiddleware(Roles.AdminAndRestaurant),
  MasterBumbuController.get
);

/**
 * @swagger
 * /api/master-bumbu/{id}:
 *   put:
 *     summary: Memperbarui master bumbu berdasarkan ID
 *     tags: [Master Bumbu]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID master bumbu
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MasterBumbuUpdateRequest'
 *     responses:
 *       200:
 *         description: Master bumbu berhasil diperbarui
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/MasterBumbu'
 *       400:
 *         description: Data yang dikirim tidak valid
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Token tidak valid atau kadaluarsa
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Role tidak diizinkan
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Master bumbu tidak ditemukan
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
privateRouter.put(
  '/api/master-bumbu/:id(\\d+)',
  authorizeMiddleware(Roles.AdminAndRestaurant),
  MasterBumbuController.update
);

/**
 * @swagger
 * /api/master-bumbu/{id}:
 *   delete:
 *     summary: Menghapus master bumbu berdasarkan ID
 *     tags: [Master Bumbu]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID master bumbu
 *     responses:
 *       200:
 *         description: Master bumbu berhasil dihapus
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       401:
 *         description: Token tidak valid atau kadaluarsa
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Role tidak diizinkan
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Master bumbu tidak ditemukan
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
privateRouter.delete(
  '/api/master-bumbu/:id(\\d+)',
  authorizeMiddleware(Roles.AdminAndRestaurant),
  MasterBumbuController.delete
);

// Master Bumbu Approval

/**
 * @swagger
 * /api/master-bumbu/{id}/status:
 *   post:
 *     summary: Memperbarui status persetujuan master bumbu (Admin)
 *     tags: [Master Bumbu]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID master bumbu
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ApprovalStatusRequest'
 *     responses:
 *       200:
 *         description: Status master bumbu berhasil diperbarui
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Data yang dikirim tidak valid
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Token tidak valid atau kadaluarsa
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Role tidak diizinkan
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Master bumbu tidak ditemukan
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
privateRouter.post(
  '/api/master-bumbu/:id(\\d+)/status',
  authorizeMiddleware(Roles.Admin),
  MasterBumbuController.updateBumbuApproval
);

// Menu Module

/**
 * @swagger
 * /api/restaurants/menu:
 *   post:
 *     summary: Membuat menu baru untuk restoran yang sedang login
 *     tags: [Menu]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/CreateMenuRequest'
 *     responses:
 *       201:
 *         description: Menu berhasil dibuat
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Data yang dikirim tidak valid
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Token tidak valid atau kadaluarsa
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Role tidak diizinkan
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
privateRouter.post(
  '/api/restaurants/menu',
  authorizeMiddleware(Roles.Restaurant),
  multerMiddleware,
  MenuController.createMenu
);

/**
 * @swagger
 * /api/restaurants/menus:
 *   get:
 *     summary: Mendapatkan daftar semua menu restoran yang sedang login
 *     tags: [Menu]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Daftar menu restoran berhasil diambil
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
 *                     $ref: '#/components/schemas/MenuSummary'
 *       401:
 *         description: Token tidak valid atau kadaluarsa
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Role tidak diizinkan
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
privateRouter.get(
  '/api/restaurants/menus',
  authorizeMiddleware(Roles.Restaurant),
  MenuController.getAllRestaurantMenu
);

/**
 * @swagger
 * /api/restaurants/menus/search:
 *   get:
 *     summary: Mencari menu restoran yang sedang login berdasarkan kata kunci
 *     tags: [Menu]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Kata kunci pencarian menu
 *     responses:
 *       200:
 *         description: Hasil pencarian menu berhasil diambil
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
 *                     $ref: '#/components/schemas/MenuSummary'
 *       401:
 *         description: Token tidak valid atau kadaluarsa
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Role tidak diizinkan
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
privateRouter.get(
  '/api/restaurants/menus/search',
  authorizeMiddleware(Roles.Restaurant),
  MenuController.searchMenu
);

/**
 * @swagger
 * /api/restaurants/menus/{menuId}:
 *   get:
 *     summary: Mendapatkan detail menu restoran berdasarkan ID
 *     tags: [Menu]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: menuId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID menu
 *     responses:
 *       200:
 *         description: Detail menu berhasil diambil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/MenuDetail'
 *       401:
 *         description: Token tidak valid atau kadaluarsa
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Role tidak diizinkan
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Menu tidak ditemukan
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
privateRouter.get(
  '/api/restaurants/menus/:menuId(\\d+)',
  authorizeMiddleware(Roles.Restaurant),
  MenuController.getMenuDetail
);

/**
 * @swagger
 * /api/restaurants/menus/{menuId}:
 *   patch:
 *     summary: Memperbarui menu restoran berdasarkan ID (termasuk gambar)
 *     tags: [Menu]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: menuId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID menu
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/UpdateMenuRequest'
 *     responses:
 *       200:
 *         description: Menu berhasil diperbarui
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Data yang dikirim tidak valid
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Token tidak valid atau kadaluarsa
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Role tidak diizinkan
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Menu tidak ditemukan
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
privateRouter.patch(
  '/api/restaurants/menus/:menuId(\\d+)',
  authorizeMiddleware(Roles.Restaurant),
  multerMiddleware,
  MenuController.updateMenu
);

/**
 * @swagger
 * /api/restaurants/menus/{menuId}:
 *   delete:
 *     summary: Menghapus menu restoran berdasarkan ID
 *     tags: [Menu]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: menuId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID menu
 *     responses:
 *       200:
 *         description: Menu berhasil dihapus
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       401:
 *         description: Token tidak valid atau kadaluarsa
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Role tidak diizinkan
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Menu tidak ditemukan
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
privateRouter.delete(
  '/api/restaurants/menus/:menuId(\\d+)',
  authorizeMiddleware(Roles.Restaurant),
  MenuController.deleteMenu
);

/**
 * @swagger
 * /api/restaurants/{restaurantId}/menus:
 *   get:
 *     summary: Mendapatkan daftar menu restoran berdasarkan ID restoran
 *     tags: [Menu]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: restaurantId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID restoran (UUID)
 *     responses:
 *       200:
 *         description: Daftar menu restoran berhasil diambil
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
 *                     $ref: '#/components/schemas/MenuSummary'
 *       401:
 *         description: Token tidak valid atau kadaluarsa
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Role tidak diizinkan
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Restoran tidak ditemukan
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
privateRouter.get(
  '/api/restaurants/:restaurantId([a-zA-Z0-9_-]+)/menus',
  authorizeMiddleware(Roles.AdminAndConsumer),
  MenuController.getAllRestaurantMenu
);

/**
 * @swagger
 * /api/restaurants/{restaurantId}/menus/search:
 *   get:
 *     summary: Mencari menu restoran berdasarkan kata kunci
 *     tags: [Menu]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: restaurantId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID restoran (UUID)
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Kata kunci pencarian menu
 *     responses:
 *       200:
 *         description: Hasil pencarian menu berhasil diambil
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
 *                     $ref: '#/components/schemas/MenuSummary'
 *       401:
 *         description: Token tidak valid atau kadaluarsa
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Role tidak diizinkan
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Restoran tidak ditemukan
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
privateRouter.get(
  '/api/restaurants/:restaurantId([a-zA-Z0-9_-]+)/menus/search',
  authorizeMiddleware(Roles.AdminAndConsumer),
  MenuController.searchMenu
);

/**
 * @swagger
 * /api/restaurants/{restaurantId}/menus/{menuId}:
 *   get:
 *     summary: Mendapatkan detail menu restoran berdasarkan ID restoran dan ID menu
 *     tags: [Menu]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: restaurantId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID restoran (UUID)
 *       - in: path
 *         name: menuId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID menu
 *     responses:
 *       200:
 *         description: Detail menu berhasil diambil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/MenuDetail'
 *       401:
 *         description: Token tidak valid atau kadaluarsa
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Role tidak diizinkan
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Menu atau restoran tidak ditemukan
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
privateRouter.get(
  '/api/restaurants/:restaurantId([a-zA-Z0-9_-]+)/menus/:menuId(\\d+)',
  authorizeMiddleware(Roles.AdminAndConsumer),
  MenuController.getMenuDetail
);

/**
 * @swagger
 * /api/restaurants/{restaurantId}/menus/{menuId}/nutrition:
 *   post:
 *     summary: Membuat data nutrisi untuk menu (Admin)
 *     tags: [Menu]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: restaurantId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID restoran (UUID)
 *       - in: path
 *         name: menuId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID menu
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MenuNutritionRequest'
 *     responses:
 *       201:
 *         description: Data nutrisi menu berhasil dibuat
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Data yang dikirim tidak valid
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Token tidak valid atau kadaluarsa
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Role tidak diizinkan
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Menu atau restoran tidak ditemukan
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
privateRouter.post(
  '/api/restaurants/:restaurantId([a-zA-Z0-9_-]+)/menus/:menuId(\\d+)/nutrition',
  authorizeMiddleware(Roles.Admin),
  MenuController.createMenuNutrition
);

/**
 * @swagger
 * /api/restaurants/{restaurantId}/menus/{menuId}/nutrition:
 *   patch:
 *     summary: Memperbarui data nutrisi menu (Admin)
 *     tags: [Menu]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: restaurantId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID restoran (UUID)
 *       - in: path
 *         name: menuId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID menu
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MenuNutritionUpdateRequest'
 *     responses:
 *       200:
 *         description: Data nutrisi menu berhasil diperbarui
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Data yang dikirim tidak valid
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Token tidak valid atau kadaluarsa
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Role tidak diizinkan
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Menu atau restoran tidak ditemukan
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
privateRouter.patch(
  '/api/restaurants/:restaurantId([a-zA-Z0-9_-]+)/menus/:menuId(\\d+)/nutrition',
  authorizeMiddleware(Roles.Admin),
  MenuController.updateMenuNutrition
);

/**
 * @swagger
 * /api/restaurants/{restaurantId}/menus/{menuId}/status:
 *   put:
 *     summary: Memperbarui status persetujuan menu (Admin)
 *     tags: [Menu]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: restaurantId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID restoran (UUID)
 *       - in: path
 *         name: menuId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID menu
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ApprovalStatusRequest'
 *     responses:
 *       200:
 *         description: Status menu berhasil diperbarui
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Data yang dikirim tidak valid
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Token tidak valid atau kadaluarsa
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Role tidak diizinkan
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Menu atau restoran tidak ditemukan
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
privateRouter.put(
  '/api/restaurants/:restaurantId([a-zA-Z0-9_-]+)/menus/:menuId(\\d+)/status',
  authorizeMiddleware(Roles.Admin),
  MenuController.updateMenuApproval
);

/**
 * @swagger
 * /api/restaurants/{restaurantId}/menus/{menuId}/recipe:
 *   put:
 *     summary: Menetapkan resep untuk menu (Restoran)
 *     tags: [Menu]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: restaurantId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID restoran (UUID)
 *       - in: path
 *         name: menuId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID menu
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SetMenuRecipeRequest'
 *     responses:
 *       200:
 *         description: Resep menu berhasil ditetapkan
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Data yang dikirim tidak valid
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Token tidak valid atau kadaluarsa
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Role tidak diizinkan
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Menu atau restoran tidak ditemukan
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
privateRouter.put(
  '/api/restaurants/:restaurantId([a-zA-Z0-9_-]+)/menus/:menuId(\\d+)/recipe',
  authorizeMiddleware(Roles.Restaurant),
  MenuController.setMenuRecipe
);

/**
 * @swagger
 * /api/restaurants/{restaurantId}/menus/{menuId}/recipe:
 *   get:
 *     summary: Mendapatkan resep menu berdasarkan ID restoran dan ID menu
 *     tags: [Menu]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: restaurantId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID restoran (UUID)
 *       - in: path
 *         name: menuId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID menu
 *     responses:
 *       200:
 *         description: Resep menu berhasil diambil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/MenuRecipe'
 *       401:
 *         description: Token tidak valid atau kadaluarsa
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Role tidak diizinkan
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Menu atau restoran tidak ditemukan
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
privateRouter.get(
  '/api/restaurants/:restaurantId([a-zA-Z0-9_-]+)/menus/:menuId(\\d+)/recipe',
  authorizeMiddleware(Roles.AdminAndRestaurant),
  MenuController.getMenuRecipe
);

/**
 * @swagger
 * /api/restaurants/{restaurantId}/menus/{menuId}/recipe:
 *   patch:
 *     summary: Memperbarui nutrisi menu berdasarkan perubahan resep
 *     tags: [Menu]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: restaurantId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID restoran (UUID)
 *       - in: path
 *         name: menuId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID menu
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SetMenuRecipeRequest'
 *     responses:
 *       200:
 *         description: Nutrisi menu berhasil diperbarui
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Data yang dikirim tidak valid
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Token tidak valid atau kadaluarsa
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Role tidak diizinkan
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Menu atau restoran tidak ditemukan
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
privateRouter.patch(
  '/api/restaurants/:restaurantId([a-zA-Z0-9_-]+)/menus/:menuId(\\d+)/recipe',
  authorizeMiddleware(Roles.AdminAndRestaurant),
  MenuController.refreshMenuNutrition
);

// Order Module

/**
 * @swagger
 * /api/consumers/orders/{recommendationId}:
 *   post:
 *     summary: Membuat pesanan baru berdasarkan rekomendasi
 *     tags: [Order]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: recommendationId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID rekomendasi
 *     responses:
 *       201:
 *         description: Pesanan berhasil dibuat
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/CreateOrderData'
 *       400:
 *         description: Data yang dikirim tidak valid
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Token tidak valid atau kadaluarsa
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Role tidak diizinkan
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Rekomendasi tidak ditemukan
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
privateRouter.post(
  '/api/consumers/orders/:recommendationId(\\d+)',
  authorizeMiddleware(Roles.Consumer),
  OrderController.createOrder
);

/**
 * @swagger
 * /api/consumers/orders:
 *   get:
 *     summary: Mendapatkan daftar semua pesanan konsumen yang sedang login
 *     tags: [Order]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Daftar pesanan berhasil diambil
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
 *                     $ref: '#/components/schemas/Order'
 *       401:
 *         description: Token tidak valid atau kadaluarsa
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Role tidak diizinkan
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
privateRouter.get(
  '/api/consumers/orders',
  authorizeMiddleware(Roles.Consumer),
  OrderController.getAllOrder
);

/**
 * @swagger
 * /api/consumers/orders/{orderId}:
 *   get:
 *     summary: Mendapatkan detail pesanan berdasarkan ID
 *     tags: [Order]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID pesanan
 *     responses:
 *       200:
 *         description: Detail pesanan berhasil diambil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Order'
 *       401:
 *         description: Token tidak valid atau kadaluarsa
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Role tidak diizinkan
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Pesanan tidak ditemukan
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
privateRouter.get(
  '/api/consumers/orders/:orderId(\\d+)',
  authorizeMiddleware(Roles.Consumer),
  OrderController.getOrderDetail
);

/**
 * @swagger
 * /api/consumers/orders/{orderId}/status:
 *   put:
 *     summary: Memperbarui status pesanan
 *     tags: [Order]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID pesanan
 *     responses:
 *       200:
 *         description: Status pesanan berhasil diperbarui
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Data yang dikirim tidak valid
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Token tidak valid atau kadaluarsa
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Role tidak diizinkan
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Pesanan tidak ditemukan
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
privateRouter.put(
  '/api/consumers/orders/:orderId(\\d+)/status',
  authorizeMiddleware(Roles.Consumer),
  OrderController.updateOrderStatus
);

/**
 * @swagger
 * /api/consumers/orders/{orderId}:
 *   delete:
 *     summary: Membatalkan pesanan berdasarkan ID
 *     tags: [Order]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID pesanan
 *     responses:
 *       200:
 *         description: Pesanan berhasil dibatalkan
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       401:
 *         description: Token tidak valid atau kadaluarsa
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Role tidak diizinkan
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Pesanan tidak ditemukan
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
privateRouter.delete(
  '/api/consumers/orders/:orderId(\\d+)',
  authorizeMiddleware(Roles.Consumer),
  OrderController.cancelOrder
);

// Notification Module

/**
 * @swagger
 * /api/notifications:
 *   get:
 *     summary: Mendapatkan daftar notifikasi admin
 *     tags: [Notification]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Daftar notifikasi berhasil diambil
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
 *                     $ref: '#/components/schemas/Notification'
 *       401:
 *         description: Token tidak valid atau kadaluarsa
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Role tidak diizinkan
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
privateRouter.get(
  '/api/notifications',
  authorizeMiddleware(Roles.Admin),
  NotificationController.getNotification
);

/**
 * @swagger
 * /api/notifications/{notificationId}:
 *   put:
 *     summary: Menandai notifikasi admin sebagai sudah dibaca
 *     tags: [Notification]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: notificationId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID notifikasi
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateNotificationReadRequest'
 *     responses:
 *       200:
 *         description: Notifikasi berhasil ditandai
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       401:
 *         description: Token tidak valid atau kadaluarsa
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Role tidak diizinkan
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Notifikasi tidak ditemukan
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
privateRouter.put(
  '/api/notifications/:notificationId(\\d+)',
  authorizeMiddleware(Roles.Admin),
  NotificationController.updateNotificationRead
);

/**
 * @swagger
 * /api/restaurants/notifications:
 *   get:
 *     summary: Mendapatkan daftar notifikasi restoran yang sedang login
 *     tags: [Notification]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Daftar notifikasi restoran berhasil diambil
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
 *                     $ref: '#/components/schemas/Notification'
 *       401:
 *         description: Token tidak valid atau kadaluarsa
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Role tidak diizinkan
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
privateRouter.get(
  '/api/restaurants/notifications',
  authorizeMiddleware(Roles.Restaurant),
  NotificationController.getRestaurantNotifications
);

/**
 * @swagger
 * /api/restaurants/notifications/{notificationId}:
 *   put:
 *     summary: Menandai notifikasi restoran sebagai sudah dibaca
 *     tags: [Notification]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: notificationId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID notifikasi
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateNotificationReadRequest'
 *     responses:
 *       200:
 *         description: Notifikasi berhasil ditandai
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       401:
 *         description: Token tidak valid atau kadaluarsa
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Role tidak diizinkan
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Notifikasi tidak ditemukan
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
privateRouter.put(
  '/api/restaurants/notifications/:notificationId(\\d+)',
  authorizeMiddleware(Roles.Restaurant),
  NotificationController.updateRestaurantNotificationRead
);

// Recommendation Module

/**
 * @swagger
 * /api/restaurants/{restaurantId}/recommendations:
 *   post:
 *     summary: Mendapatkan rekomendasi menu dari model AI berdasarkan preferensi
 *     tags: [Recommendation]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: restaurantId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID restoran (UUID)
 *     responses:
 *       201:
 *         description: Rekomendasi berhasil dibuat oleh model AI
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Data yang dikirim tidak valid
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Token tidak valid atau kadaluarsa
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Role tidak diizinkan
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Restoran tidak ditemukan
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
privateRouter.post(
  '/api/restaurants/:restaurantId([a-zA-Z0-9_-]+)/recommendations',
  authorizeMiddleware(Roles.Consumer),
  RecommendationController.getRecommendationFromModel
);

/**
 * @swagger
 * /api/restaurants/{restaurantId}/recommendations:
 *   get:
 *     summary: Mendapatkan daftar rekomendasi konsumen yang sedang login untuk restoran tertentu
 *     tags: [Recommendation]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: restaurantId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID restoran (UUID)
 *     responses:
 *       200:
 *         description: Daftar rekomendasi berhasil diambil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Recommendation'
 *       401:
 *         description: Token tidak valid atau kadaluarsa
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Role tidak diizinkan
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Restoran tidak ditemukan
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
privateRouter.get(
  '/api/restaurants/:restaurantId([a-zA-Z0-9_-]+)/recommendations',
  authorizeMiddleware(Roles.Consumer),
  RecommendationController.getRecommendation
);

/**
 * @swagger
 * /api/restaurants/{restaurantId}/recommendations/{recommendationId}:
 *   get:
 *     summary: Mendapatkan detail rekomendasi berdasarkan ID
 *     tags: [Recommendation]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: restaurantId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID restoran (UUID)
 *       - in: path
 *         name: recommendationId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID rekomendasi
 *     responses:
 *       200:
 *         description: Detail rekomendasi berhasil diambil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/RecommendationDetail'
 *       401:
 *         description: Token tidak valid atau kadaluarsa
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Role tidak diizinkan
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Rekomendasi tidak ditemukan
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
privateRouter.get(
  '/api/restaurants/:restaurantId([a-zA-Z0-9_-]+)/recommendations/:recommendationId(\\d+)',
  authorizeMiddleware(Roles.Consumer),
  RecommendationController.getRecommendationDetail
);

// Auth module

/**
 * @swagger
 * /api/auth/email:
 *   put:
 *     summary: Memperbarui alamat email pengguna
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateEmailRequest'
 *     responses:
 *       200:
 *         description: Email berhasil diperbarui
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Data yang dikirim tidak valid
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Token tidak valid atau kadaluarsa
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Role tidak diizinkan
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
privateRouter.put(
  '/api/auth/email',
  authorizeMiddleware(Roles.All),
  AuthController.updateEmail
);

/**
 * @swagger
 * /api/auth/password:
 *   put:
 *     summary: Memperbarui kata sandi pengguna
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdatePasswordRequest'
 *     responses:
 *       200:
 *         description: Kata sandi berhasil diperbarui
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Data yang dikirim tidak valid
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Token tidak valid atau kadaluarsa
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Role tidak diizinkan
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
privateRouter.put(
  '/api/auth/password',
  authorizeMiddleware(Roles.All),
  AuthController.updatePassword
);

/**
 * @swagger
 * /api/auth/logout:
 *   delete:
 *     summary: Keluar dari sesi pengguna (logout)
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout berhasil
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       401:
 *         description: Token tidak valid atau kadaluarsa
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Role tidak diizinkan
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
privateRouter.delete(
  '/api/auth/logout',
  authorizeMiddleware(Roles.All),
  AuthController.logout
);
