# Stage 1: Build Stage
FROM node:20 AS build

# Set working directory
WORKDIR /app

# Salin package.json dan package-lock.json dari folder precifood-backend ke dalam image
COPY precifood-backend/package*.json ./

# Install dependencies
RUN npm install --production=false

# Salin seluruh kode aplikasi dari folder precifood-backend
COPY precifood-backend/ .

# Build aplikasi TypeScript
RUN npm run build

# Stage 2: Production Stage
FROM node:20 AS production

# Set working directory
WORKDIR /app

# Salin dependencies dari build stage
COPY --from=build /app/node_modules /app/node_modules

# Salin aplikasi yang sudah dibangun
COPY --from=build /app/dist /app/dist

# Salin file .env jika diperlukan
COPY precifood-backend/.env .env

# Expose port aplikasi
EXPOSE 8000

# Jalankan aplikasi
CMD ["npm", "run", "start"]
