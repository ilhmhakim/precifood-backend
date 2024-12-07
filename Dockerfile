# Gunakan node:20 sebagai base image
FROM node:20

# Set working directory
WORKDIR /app

# Salin package.json dan package-lock.json
COPY package*.json ./

# Install dependencies dengan npm ci untuk build yang lebih konsisten
RUN npm ci

# Salin folder prisma dan file lainnya (pastikan file .env ada di sini jika diperlukan)
COPY prisma ./prisma

# Salin file .env untuk memastikan variabel lingkungan tersedia
COPY .env .env

# Jalankan prisma generate untuk membangun Prisma Client
RUN npx prisma generate

# Salin seluruh kode aplikasi
COPY . .

# Bangun aplikasi TypeScript
RUN npm run build

# Install dependencies untuk produksi
RUN npm ci --only=production

# Expose port aplikasi
EXPOSE 8000

# Jalankan aplikasi
CMD ["npm", "start"]
