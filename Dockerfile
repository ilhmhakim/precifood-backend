# Stage 1: Build Stage
FROM node:20-alpine AS build

# Set working directory di dalam container
WORKDIR /app

# Salin package.json dan package-lock.json ke dalam container
COPY app/package*.json ./

# Install dependencies (termasuk dev dependencies untuk build)
RUN npm install --production=false

# Salin seluruh kode aplikasi dari folder app ke dalam container
COPY app/ ./

# Jalankan prisma generate untuk generate Prisma client
RUN npx prisma generate

# Build aplikasi TypeScript
RUN npm run build

# Stage 2: Production Stage
FROM node:20-alpine AS production

# Set working directory di dalam container
WORKDIR /app

# Salin package.json dan package-lock.json ke dalam image produksi
COPY app/package*.json ./

# Salin prisma dari build stage
COPY --from=build /app/prisma ./

# Salin node_modules dari build stage
COPY --from=build /app/node_modules /app/node_modules

# Salin hasil build (dist) dari build stage
COPY --from=build /app/dist /app/dist

# Salin file .env dari folder app ke dalam container
COPY app/.env .env

# Expose port aplikasi
EXPOSE 8000

# Jalankan aplikasi di stage produksi
CMD ["npm", "run", "start"]
