import swaggerJsdoc from 'swagger-jsdoc';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'PreciFood API Documentation',
    version: '1.0.0',
    description:
      'Backend API PreciFood, Sistem rekomendasi menu makanan berdasarkan profil konsumen',
    contact: {
      name: 'PreciFood Team',
    },
  },
  servers: [
    {
      url: `http://localhost:${process.env.PORT || 5100}`,
      description: 'Development server',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Masukkan JWT access token dari endpoint /api/auth/login',
      },
    },
    schemas: {
      Error: {
        type: 'object',
        properties: {
          errors: {
            type: 'string',
            description: 'Pesan error',
          },
        },
      },
      SuccessResponse: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
            example: 'Success!',
          },
        },
      },
      SuccessWithData: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
            example: 'Success!',
          },
          data: {
            type: 'object',
          },
        },
      },
      LoginRequest: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: {
            type: 'string',
            format: 'email',
            example: 'user@example.com',
          },
          password: {
            type: 'string',
            minLength: 8,
            example: 'password123',
          },
        },
      },
      LoginResponse: {
        type: 'object',
        properties: {
          message: { type: 'string', example: 'Success!' },
          data: {
            type: 'object',
            properties: {
              role: { type: 'string', example: 'Konsumen' },
              access_token: { type: 'string' },
              refresh_token: { type: 'string' },
            },
          },
        },
      },
      RefreshTokenRequest: {
        type: 'object',
        required: ['refresh_token'],
        properties: {
          refresh_token: {
            type: 'string',
          },
        },
      },
      RefreshTokenResponse: {
        type: 'object',
        properties: {
          message: { type: 'string', example: 'Success!' },
          data: {
            type: 'object',
            properties: {
              access_token: { type: 'string' },
            },
          },
        },
      },
      RegisterConsumerRequest: {
        type: 'object',
        required: [
          'name',
          'email',
          'sex',
          'birth',
          'phone',
          'height',
          'weight',
          'medical_history',
          'password',
          'password_confirmation',
        ],
        properties: {
          name: { type: 'string', maxLength: 255 },
          email: { type: 'string', format: 'email' },
          sex: { type: 'string', enum: ['Laki-laki', 'Perempuan'] },
          birth: {
            type: 'string',
            pattern: '^\\d{4}-\\d{2}-\\d{2}$',
            example: '2000-01-01',
          },
          phone: { type: 'string', pattern: '^\\+?\\d{10,20}$' },
          height: { type: 'number' },
          weight: { type: 'number' },
          medical_history: {
            type: 'string',
            enum: ['no_history', 'diabetes', 'cardiovascular', 'hypertension'],
          },
          password: { type: 'string', minLength: 8 },
          password_confirmation: { type: 'string', minLength: 8 },
        },
      },
      RegisterRestaurantRequest: {
        type: 'object',
        required: [
          'name',
          'email',
          'phone',
          'province',
          'city',
          'address_detail',
          'password',
          'password_confirmation',
        ],
        properties: {
          name: { type: 'string', maxLength: 255 },
          email: { type: 'string', format: 'email' },
          phone: { type: 'string', pattern: '^\\+?\\d{10,20}$' },
          province: { type: 'string', maxLength: 100 },
          city: { type: 'string', maxLength: 100 },
          address_detail: { type: 'string' },
          password: { type: 'string', minLength: 8 },
          password_confirmation: { type: 'string', minLength: 8 },
        },
      },
      UpdateEmailRequest: {
        type: 'object',
        required: ['new_email', 'password'],
        properties: {
          new_email: { type: 'string', format: 'email' },
          password: { type: 'string', minLength: 8 },
        },
      },
      UpdatePasswordRequest: {
        type: 'object',
        required: ['old_password', 'new_password', 'password_confirmation'],
        properties: {
          old_password: { type: 'string', minLength: 8 },
          new_password: { type: 'string', minLength: 8 },
          password_confirmation: { type: 'string', minLength: 8 },
        },
      },
    },
  },
  tags: [
    {
      name: 'Auth',
      description:
        'Autentikasi — login, refresh token, ubah email/password, logout',
    },
    {
      name: 'User',
      description: 'Manajemen user — registrasi, profil, daftar restoran',
    },
    { name: 'Master Bahan Type', description: 'Tipe bahan masakan' },
    {
      name: 'Master Bahan',
      description: 'CRUD bahan masakan + approval admin',
    },
    {
      name: 'Master Bumbu',
      description: 'CRUD bumbu masakan + approval admin',
    },
    {
      name: 'Menu',
      description: 'CRUD menu restoran, nutrisi, resep, approval',
    },
    { name: 'Order', description: 'Pemesanan menu' },
    { name: 'Notification', description: 'Notifikasi admin & restoran' },
    { name: 'Recommendation', description: 'Rekomendasi menu dari model ML' },
    { name: 'Seed', description: 'Seeder database (development only)' },
  ],
};

const options: swaggerJsdoc.Options = {
  swaggerDefinition,
  apis:
    process.env.NODE_ENV === 'production'
      ? ['./dist/route/*.js']
      : ['./src/route/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
