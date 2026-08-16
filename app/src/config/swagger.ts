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
      // ===== Master Bahan Type =====
      MasterBahanType: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          name: { type: 'string', example: 'Sayuran' },
        },
      },
      // ===== Master Bahan =====
      MasterBahanCreateRequest: {
        type: 'object',
        required: [
          'name',
          'type_id',
          'bdd',
          'calory',
          'protein',
          'fat',
          'carbohydrate',
          'fiber',
          'natrium',
          'cholesterol',
          'sfa',
          'mufa',
          'pufa',
        ],
        properties: {
          name: {
            type: 'string',
            minLength: 1,
            maxLength: 255,
            example: 'Brokoli',
          },
          type_id: {
            type: 'integer',
            description: 'ID tipe master bahan',
            example: 1,
          },
          bdd: {
            type: 'integer',
            minimum: 1,
            maximum: 100,
            default: 100,
            description: 'Berat Dapat Dimakan (%), per 100g',
            example: 100,
          },
          calory: { type: 'number', minimum: 0, example: 34 },
          protein: { type: 'number', minimum: 0, example: 2.8 },
          fat: { type: 'number', minimum: 0, example: 0.4 },
          carbohydrate: { type: 'number', minimum: 0, example: 6.6 },
          fiber: { type: 'number', minimum: 0, example: 2.6 },
          natrium: { type: 'number', minimum: 0, example: 33 },
          cholesterol: { type: 'number', minimum: 0, example: 0 },
          sfa: { type: 'number', minimum: 0, example: 0.1 },
          mufa: { type: 'number', minimum: 0, example: 0.0 },
          pufa: { type: 'number', minimum: 0, example: 0.2 },
        },
      },
      MasterBahanUpdateRequest: {
        type: 'object',
        properties: {
          name: { type: 'string', minLength: 1, maxLength: 255 },
          type_id: { type: 'integer', description: 'ID tipe master bahan' },
          bdd: { type: 'integer', minimum: 1, maximum: 100 },
          calory: { type: 'number', minimum: 0 },
          protein: { type: 'number', minimum: 0 },
          fat: { type: 'number', minimum: 0 },
          carbohydrate: { type: 'number', minimum: 0 },
          fiber: { type: 'number', minimum: 0 },
          natrium: { type: 'number', minimum: 0 },
          cholesterol: { type: 'number', minimum: 0 },
          sfa: { type: 'number', minimum: 0 },
          mufa: { type: 'number', minimum: 0 },
          pufa: { type: 'number', minimum: 0 },
        },
      },
      MasterBahan: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          name: { type: 'string', example: 'Brokoli' },
          type_id: { type: 'integer', example: 1 },
          type_name: { type: 'string', example: 'Sayuran' },
          bdd: { type: 'integer', example: 100 },
          calory: { type: 'number', example: 34 },
          protein: { type: 'number', example: 2.8 },
          fat: { type: 'number', example: 0.4 },
          carbohydrate: { type: 'number', example: 6.6 },
          fiber: { type: 'number', example: 2.6 },
          natrium: { type: 'number', example: 33 },
          cholesterol: { type: 'number', example: 0 },
          sfa: { type: 'number', example: 0.1 },
          mufa: { type: 'number', example: 0.0 },
          pufa: { type: 'number', example: 0.2 },
          status: { type: 'string', enum: ['Approved', 'Waiting', 'Rejected'] },
          created_at: { type: 'string', format: 'date-time' },
          updated_at: { type: 'string', format: 'date-time' },
        },
      },
      // ===== Master Bumbu =====
      MasterBumbuCreateRequest: {
        type: 'object',
        required: [
          'name',
          'bdd',
          'calory',
          'protein',
          'fat',
          'carbohydrate',
          'fiber',
          'natrium',
          'cholesterol',
          'sfa',
          'mufa',
          'pufa',
        ],
        properties: {
          name: {
            type: 'string',
            minLength: 1,
            maxLength: 255,
            example: 'Bawang Merah',
          },
          cooking_type: {
            type: 'string',
            maxLength: 50,
            nullable: true,
            description: 'Tipe masak (opsional)',
            example: 'Tumis',
          },
          bdd: {
            type: 'integer',
            minimum: 1,
            maximum: 100,
            default: 100,
            description: 'Berat Dapat Dimakan (%), per 100g',
            example: 100,
          },
          calory: { type: 'number', minimum: 0, example: 72 },
          protein: { type: 'number', minimum: 0, example: 1.1 },
          fat: { type: 'number', minimum: 0, example: 0.1 },
          carbohydrate: { type: 'number', minimum: 0, example: 16.8 },
          fiber: { type: 'number', minimum: 0, example: 1.7 },
          natrium: { type: 'number', minimum: 0, example: 4 },
          cholesterol: { type: 'number', minimum: 0, example: 0 },
          sfa: { type: 'number', minimum: 0, example: 0.0 },
          mufa: { type: 'number', minimum: 0, example: 0.0 },
          pufa: { type: 'number', minimum: 0, example: 0.1 },
        },
      },
      MasterBumbuUpdateRequest: {
        type: 'object',
        properties: {
          name: { type: 'string', minLength: 1, maxLength: 255 },
          cooking_type: {
            type: 'string',
            maxLength: 50,
            nullable: true,
          },
          bdd: { type: 'integer', minimum: 1, maximum: 100 },
          calory: { type: 'number', minimum: 0 },
          protein: { type: 'number', minimum: 0 },
          fat: { type: 'number', minimum: 0 },
          carbohydrate: { type: 'number', minimum: 0 },
          fiber: { type: 'number', minimum: 0 },
          natrium: { type: 'number', minimum: 0 },
          cholesterol: { type: 'number', minimum: 0 },
          sfa: { type: 'number', minimum: 0 },
          mufa: { type: 'number', minimum: 0 },
          pufa: { type: 'number', minimum: 0 },
        },
      },
      MasterBumbu: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          name: { type: 'string', example: 'Bawang Merah' },
          cooking_type: { type: 'string', nullable: true, example: 'Tumis' },
          bdd: { type: 'integer', example: 100 },
          calory: { type: 'number', example: 72 },
          protein: { type: 'number', example: 1.1 },
          fat: { type: 'number', example: 0.1 },
          carbohydrate: { type: 'number', example: 16.8 },
          fiber: { type: 'number', example: 1.7 },
          natrium: { type: 'number', example: 4 },
          cholesterol: { type: 'number', example: 0 },
          sfa: { type: 'number', example: 0.0 },
          mufa: { type: 'number', example: 0.0 },
          pufa: { type: 'number', example: 0.1 },
          status: { type: 'string', enum: ['Approved', 'Waiting', 'Rejected'] },
          created_at: { type: 'string', format: 'date-time' },
          updated_at: { type: 'string', format: 'date-time' },
        },
      },
      // ===== Approval (shared) =====
      ApprovalStatusRequest: {
        type: 'object',
        required: ['status'],
        properties: {
          status: {
            type: 'string',
            enum: ['Approved', 'Waiting', 'Rejected'],
            example: 'Approved',
          },
          reason: {
            type: 'string',
            maxLength: 255,
            description: 'Alasan persetujuan/penolakan (opsional)',
          },
        },
      },
      // ===== Menu =====
      CreateMenuRequest: {
        type: 'object',
        required: ['name', 'category', 'price', 'portion', 'description'],
        properties: {
          name: { type: 'string', minLength: 1, maxLength: 255 },
          category: {
            type: 'string',
            enum: ['Makanan Pokok', 'Lauk Pauk', 'Minuman', 'Sayuran', 'Snack'],
          },
          price: {
            type: 'integer',
            description: 'Harga menu (dikirim sebagai string)',
          },
          portion: {
            type: 'integer',
            description: 'Porsi menu (dikirim sebagai string)',
          },
          description: { type: 'string', minLength: 1 },
          image: {
            type: 'string',
            format: 'binary',
            description: 'Gambar menu (opsional)',
          },
        },
      },
      UpdateMenuRequest: {
        type: 'object',
        properties: {
          name: { type: 'string', minLength: 1, maxLength: 255 },
          category: {
            type: 'string',
            enum: ['Makanan Pokok', 'Lauk Pauk', 'Minuman', 'Sayuran', 'Snack'],
          },
          price: { type: 'integer' },
          portion: { type: 'integer' },
          description: { type: 'string', minLength: 1 },
          image: { type: 'string', format: 'binary' },
        },
      },
      MenuNutritionRequest: {
        type: 'object',
        required: [
          'weight_per_portion',
          'weight_with_bdd',
          'calory',
          'protein',
          'fat',
          'carbohydrate',
          'fiber',
          'natrium',
          'cholesterol',
          'sfa',
          'mufa',
          'pufa',
        ],
        properties: {
          weight_per_portion: {
            type: 'number',
            description: 'Berat per porsi (gram)',
          },
          weight_with_bdd: {
            type: 'number',
            description: 'Berat dengan BDD (gram)',
          },
          calory: { type: 'number' },
          protein: { type: 'number' },
          fat: { type: 'number' },
          carbohydrate: { type: 'number' },
          fiber: { type: 'number' },
          natrium: { type: 'number' },
          cholesterol: { type: 'number' },
          sfa: { type: 'number' },
          mufa: { type: 'number' },
          pufa: { type: 'number' },
        },
      },
      MenuNutritionUpdateRequest: {
        type: 'object',
        properties: {
          weight_per_portion: { type: 'number' },
          weight_with_bdd: { type: 'number' },
          calory: { type: 'number' },
          protein: { type: 'number' },
          fat: { type: 'number' },
          carbohydrate: { type: 'number' },
          fiber: { type: 'number' },
          natrium: { type: 'number' },
          cholesterol: { type: 'number' },
          sfa: { type: 'number' },
          mufa: { type: 'number' },
          pufa: { type: 'number' },
        },
      },
      SetMenuRecipeRequest: {
        type: 'object',
        required: ['items'],
        properties: {
          items: {
            type: 'array',
            items: { $ref: '#/components/schemas/RecipeItemInput' },
          },
        },
      },
      RecipeItemInput: {
        type: 'object',
        required: ['item_id', 'item_type', 'quantity_grams'],
        properties: {
          item_id: {
            type: 'integer',
            description: 'ID master bahan atau bumbu',
          },
          item_type: { type: 'string', enum: ['bahan', 'bumbu'] },
          quantity_grams: { type: 'number', description: 'Jumlah dalam gram' },
        },
      },
      MenuSummary: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          name: { type: 'string' },
          price: { type: 'integer' },
          status: { type: 'string', enum: ['Approved', 'Waiting', 'Rejected'] },
          portion: { type: 'integer' },
          category: { type: 'string' },
          description: { type: 'string' },
          image_url: { type: 'string' },
        },
      },
      MenuNutrition: {
        type: 'object',
        properties: {
          weight_per_portion: { type: 'number', nullable: true },
          weight_with_bdd: { type: 'number', nullable: true },
          calory: { type: 'number', nullable: true },
          protein: { type: 'number', nullable: true },
          fat: { type: 'number', nullable: true },
          carbohydrate: { type: 'number', nullable: true },
          fiber: { type: 'number', nullable: true },
          natrium: { type: 'number', nullable: true },
          cholesterol: { type: 'number', nullable: true },
          sfa: { type: 'number', nullable: true },
          mufa: { type: 'number', nullable: true },
          pufa: { type: 'number', nullable: true },
        },
      },
      MenuDetail: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          name: { type: 'string' },
          price: { type: 'integer' },
          status: { type: 'string', enum: ['Approved', 'Waiting', 'Rejected'] },
          portion: { type: 'integer' },
          category: { type: 'string' },
          description: { type: 'string' },
          image_url: { type: 'string' },
          nutrition: { $ref: '#/components/schemas/MenuNutrition' },
          nutrition_per_portion: { $ref: '#/components/schemas/MenuNutrition' },
          menu_approval_logs: { type: 'array', items: { type: 'object' } },
        },
      },
      MenuRecipe: {
        type: 'object',
        properties: {
          menu_id: { type: 'integer' },
          menu_name: { type: 'string' },
          items: {
            type: 'array',
            items: { $ref: '#/components/schemas/RecipeItemResponse' },
          },
        },
      },
      RecipeItemResponse: {
        type: 'object',
        properties: {
          item_id: { type: 'integer' },
          item_name: { type: 'string' },
          item_type: { type: 'string', enum: ['bahan', 'bumbu'] },
          quantity_grams: { type: 'number' },
        },
      },
      // ===== Order =====
      CreateOrderData: {
        type: 'object',
        properties: {
          consumer_name: { type: 'string' },
          restaurant_name: { type: 'string' },
          total_price: { type: 'integer' },
        },
      },
      OrderDetailItem: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          menu_id: { type: 'integer' },
          menu_name: { type: 'string' },
          menu_category: { type: 'string' },
          menu_price: { type: 'integer' },
          menu_portion: { type: 'integer' },
        },
      },
      Order: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          restaurant_name: { type: 'string' },
          total_price: { type: 'integer' },
          ordered_at: { type: 'number', description: 'Unix timestamp (ms)' },
          status: { type: 'string' },
          description: { type: 'string' },
          order_detail: {
            type: 'array',
            items: { $ref: '#/components/schemas/OrderDetailItem' },
          },
        },
      },
      // ===== Notification =====
      Notification: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          title: { type: 'string' },
          restaurant_name: { type: 'string' },
          restaurant_id: { type: 'string' },
          menu_id: { type: 'integer', nullable: true },
          menu_name: { type: 'string', nullable: true },
          bahan_id: { type: 'integer', nullable: true },
          bahan_name: { type: 'string', nullable: true },
          bumbu_id: { type: 'integer', nullable: true },
          bumbu_name: { type: 'string', nullable: true },
          is_read: { type: 'boolean' },
          created_at: { type: 'string', format: 'date-time' },
          updated_at: { type: 'string', format: 'date-time' },
        },
      },
      UpdateNotificationReadRequest: {
        type: 'object',
        required: ['is_read'],
        properties: {
          is_read: { type: 'boolean' },
        },
      },
      // ===== Recommendation =====
      Recommendation: {
        type: 'object',
        properties: {
          restaurant_id: { type: 'string' },
          restaurant_name: { type: 'string' },
          recommended_at: {
            type: 'number',
            description: 'Unix timestamp (ms)',
          },
          status: {
            type: 'object',
            properties: {
              is_generating: { type: 'boolean' },
              generator_error: { type: 'string', nullable: true },
            },
          },
          recommendations: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'integer' },
                rank: { type: 'integer' },
                description: { type: 'string' },
                total_price: { type: 'integer' },
                image_url: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: { url: { type: 'string' } },
                  },
                },
              },
            },
          },
        },
      },
      RecommendationDetail: {
        type: 'object',
        properties: {
          total_price: { type: 'integer' },
          nutrition_summary: {
            type: 'object',
            properties: {
              calory: { type: 'number' },
              protein: { type: 'number' },
              fat: { type: 'number' },
              carbohydrate: { type: 'number' },
            },
          },
          recommendations: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                menu_id: { type: 'integer' },
                name: { type: 'string' },
                category: { type: 'string' },
                portion: { type: 'integer' },
                price: { type: 'integer' },
                description: { type: 'string' },
                image_url: { type: 'string' },
              },
            },
          },
        },
      },
      // ===== User =====
      UpdateConsumerRequest: {
        type: 'object',
        properties: {
          name: { type: 'string', minLength: 1, maxLength: 255 },
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
        },
      },
      UpdateRestaurantRequest: {
        type: 'object',
        properties: {
          name: { type: 'string', minLength: 1, maxLength: 255 },
          email: { type: 'string', format: 'email' },
          phone: { type: 'string', pattern: '^\\+?\\d{10,20}$' },
          province: { type: 'string', maxLength: 100 },
          city: { type: 'string', maxLength: 100 },
          address_detail: { type: 'string' },
          image_url: {
            type: 'string',
            format: 'binary',
            description: 'Foto profil restoran (opsional)',
          },
        },
      },
      ConsumerProfile: {
        type: 'object',
        properties: {
          user: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              email: { type: 'string', format: 'email' },
              registered_at: { type: 'string', format: 'date-time' },
            },
          },
          personal_information: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              sex: { type: 'string' },
              birth: { type: 'string' },
              phone: { type: 'string' },
              height: { type: 'number' },
              weight: { type: 'number' },
              age: { type: 'integer' },
            },
          },
          medical_history: { type: 'string' },
        },
      },
      RestaurantProfile: {
        type: 'object',
        properties: {
          user: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              email: { type: 'string', format: 'email' },
              registered_at: { type: 'string' },
            },
          },
          contact: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              email: { type: 'string', format: 'email' },
              phone: { type: 'string' },
            },
          },
          address: {
            type: 'object',
            properties: {
              province: { type: 'string' },
              city: { type: 'string' },
              address_detail: { type: 'string' },
              image_url: { type: 'string' },
            },
          },
        },
      },
      ConsumerInfo: {
        type: 'object',
        properties: {
          personal_information: {
            type: 'object',
            properties: {
              height: { type: 'number' },
              weight: { type: 'number' },
            },
          },
          medical_history: { type: 'string' },
        },
      },
      UserSummary: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          email: { type: 'string', format: 'email' },
          phone: { type: 'string' },
        },
      },
      RestaurantPublic: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
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
