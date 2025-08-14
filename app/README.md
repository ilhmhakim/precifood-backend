# Setup Project

Create .env file

```
    NODE_ENV=development

    PORT=5100

    POSTGRES_PRISMA_URL="postgresql://postgres:root@localhost:5432/precifood_database?schema=public"
    POSTGRES_URL_NON_POOLING="postgresql://postgres:root@localhost:5432/precifood_database?schema=public"

    GOOGLE_APPLICATION_CREDENTIALS_JSON=""

    MODEL_URL=""

    JWT_SECRET="secret"
    JWT_SECRET_EXPIRE="24h"
    JWT_SECRET_REFRESH="secret_refresh_token"
    JWT_SECRET_REFRESH_EXPIRE="7d"
```

```shell

npm install

npx prisma migrate dev

npx prisma generate

npm run build

npm run start

POST {{baseUrl}}/api/seeds to seeds database (development only)
POST {{baseUrl}}/api/seeds/master-bahan-bumbu to seeds master bahan and bumbu (development only)

```
