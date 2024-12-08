# Setup Project

Create .env file

```
    DATABASE_URL="postgresql://username:password@localhost:5432/precifood_database?schema=public"
    JWT_SECRET="Bebas"
    JWT_SECRET_EXPIRE="xh"
```

```shell

npm install

npx prisma migrate dev

npx prisma generate

npm run build

npm run start

```