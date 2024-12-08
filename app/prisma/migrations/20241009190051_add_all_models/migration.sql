-- CreateEnum
CREATE TYPE "RoleName" AS ENUM ('Konsumen', 'Restoran', 'Admin');

-- CreateEnum
CREATE TYPE "ConsumerSex" AS ENUM ('Laki-laki', 'Perempuan');

-- CreateEnum
CREATE TYPE "MenuCategory" AS ENUM ('Makanan Pokok', 'Lauk Pauk', 'Sayuran', 'Minuman');

-- CreateEnum
CREATE TYPE "MenuStatus" AS ENUM ('Approved', 'Waiting', 'Rejected');

-- CreateTable
CREATE TABLE "Role" (
    "id" SERIAL NOT NULL,
    "name" "RoleName" NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" VARCHAR(38) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "registered_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "token" VARCHAR(36),
    "role_id" INTEGER NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Consumer" (
    "consumer_id" VARCHAR(38) NOT NULL,

    CONSTRAINT "Consumer_pkey" PRIMARY KEY ("consumer_id")
);

-- CreateTable
CREATE TABLE "MedicalHistory" (
    "consumer_id" VARCHAR(38) NOT NULL,
    "no_history" BOOLEAN NOT NULL DEFAULT false,
    "diabetes" BOOLEAN NOT NULL DEFAULT false,
    "hypertension" BOOLEAN NOT NULL DEFAULT false,
    "cardiovascular" BOOLEAN NOT NULL DEFAULT false,
    "updated_at" TIMESTAMP(0) NOT NULL,

    CONSTRAINT "MedicalHistory_pkey" PRIMARY KEY ("consumer_id")
);

-- CreateTable
CREATE TABLE "PersonalInformation" (
    "consumer_id" VARCHAR(38) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "sex" "ConsumerSex" NOT NULL,
    "weight" INTEGER NOT NULL,
    "height" INTEGER NOT NULL,
    "age" INTEGER NOT NULL,
    "birth" DATE NOT NULL,
    "phone" VARCHAR(20) NOT NULL,

    CONSTRAINT "PersonalInformation_pkey" PRIMARY KEY ("consumer_id")
);

-- CreateTable
CREATE TABLE "Recommendation" (
    "id" SERIAL NOT NULL,
    "restaurant_id" VARCHAR(38) NOT NULL,
    "restaurant_name" VARCHAR(255) NOT NULL,
    "recommended_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "consumer_id" VARCHAR(38) NOT NULL,

    CONSTRAINT "Recommendation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecommendationList" (
    "id" SERIAL NOT NULL,
    "rank" INTEGER NOT NULL,
    "recommendation_id" INTEGER NOT NULL,

    CONSTRAINT "RecommendationList_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecommendationListDetail" (
    "id" SERIAL NOT NULL,
    "menu_id" INTEGER NOT NULL,
    "recommendation_list_id" INTEGER NOT NULL,

    CONSTRAINT "RecommendationListDetail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Restaurant" (
    "restaurant_id" VARCHAR(38) NOT NULL,

    CONSTRAINT "Restaurant_pkey" PRIMARY KEY ("restaurant_id")
);

-- CreateTable
CREATE TABLE "Contact" (
    "restaurant_id" VARCHAR(38) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "phone" VARCHAR(20) NOT NULL,

    CONSTRAINT "Contact_pkey" PRIMARY KEY ("restaurant_id")
);

-- CreateTable
CREATE TABLE "Address" (
    "restaurant_id" VARCHAR(38) NOT NULL,
    "province" VARCHAR(100) NOT NULL,
    "city" VARCHAR(100) NOT NULL,
    "image_url" TEXT NOT NULL,

    CONSTRAINT "Address_pkey" PRIMARY KEY ("restaurant_id")
);

-- CreateTable
CREATE TABLE "Menu" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "category" "MenuCategory" NOT NULL,
    "price" INTEGER NOT NULL,
    "portion" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "image_url" TEXT NOT NULL,
    "status" "MenuStatus" NOT NULL,
    "updated_at" TIMESTAMP(0) NOT NULL,
    "restaurant_id" VARCHAR(38) NOT NULL,

    CONSTRAINT "Menu_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ingredient" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "quantity" INTEGER NOT NULL,
    "mass" DOUBLE PRECISION NOT NULL,
    "description" TEXT NOT NULL,
    "menu_id" INTEGER NOT NULL,

    CONSTRAINT "Ingredient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Nutrition" (
    "menu_id" INTEGER NOT NULL,
    "weight_per_portion" DOUBLE PRECISION NOT NULL,
    "calory" INTEGER NOT NULL,
    "protein" DOUBLE PRECISION NOT NULL,
    "fat" DOUBLE PRECISION NOT NULL,
    "carbohydrate" DOUBLE PRECISION NOT NULL,
    "sodium" DOUBLE PRECISION NOT NULL,
    "cholesterol" DOUBLE PRECISION NOT NULL,
    "sfa" DOUBLE PRECISION NOT NULL,
    "mufa" DOUBLE PRECISION NOT NULL,
    "pufa" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Nutrition_pkey" PRIMARY KEY ("menu_id")
);

-- CreateTable
CREATE TABLE "Admin" (
    "admin_id" VARCHAR(38) NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("admin_id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "restaurant_name" VARCHAR(255) NOT NULL,
    "restaurant_id" VARCHAR(38) NOT NULL,
    "menu_id" INTEGER NOT NULL,
    "menu_name" VARCHAR(255) NOT NULL,
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "admin_id" VARCHAR(38) NOT NULL,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Consumer" ADD CONSTRAINT "Consumer_consumer_id_fkey" FOREIGN KEY ("consumer_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MedicalHistory" ADD CONSTRAINT "MedicalHistory_consumer_id_fkey" FOREIGN KEY ("consumer_id") REFERENCES "Consumer"("consumer_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PersonalInformation" ADD CONSTRAINT "PersonalInformation_consumer_id_fkey" FOREIGN KEY ("consumer_id") REFERENCES "Consumer"("consumer_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Recommendation" ADD CONSTRAINT "Recommendation_consumer_id_fkey" FOREIGN KEY ("consumer_id") REFERENCES "Consumer"("consumer_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecommendationList" ADD CONSTRAINT "RecommendationList_recommendation_id_fkey" FOREIGN KEY ("recommendation_id") REFERENCES "Recommendation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecommendationListDetail" ADD CONSTRAINT "RecommendationListDetail_recommendation_list_id_fkey" FOREIGN KEY ("recommendation_list_id") REFERENCES "RecommendationList"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Restaurant" ADD CONSTRAINT "Restaurant_restaurant_id_fkey" FOREIGN KEY ("restaurant_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contact" ADD CONSTRAINT "Contact_restaurant_id_fkey" FOREIGN KEY ("restaurant_id") REFERENCES "Restaurant"("restaurant_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_restaurant_id_fkey" FOREIGN KEY ("restaurant_id") REFERENCES "Restaurant"("restaurant_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Menu" ADD CONSTRAINT "Menu_restaurant_id_fkey" FOREIGN KEY ("restaurant_id") REFERENCES "Restaurant"("restaurant_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ingredient" ADD CONSTRAINT "Ingredient_menu_id_fkey" FOREIGN KEY ("menu_id") REFERENCES "Menu"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Nutrition" ADD CONSTRAINT "Nutrition_menu_id_fkey" FOREIGN KEY ("menu_id") REFERENCES "Menu"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Admin" ADD CONSTRAINT "Admin_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "Admin"("admin_id") ON DELETE RESTRICT ON UPDATE CASCADE;
