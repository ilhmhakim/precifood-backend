-- CreateEnum
CREATE TYPE "RecipeItemType" AS ENUM ('bahan', 'bumbu');

-- CreateTable
CREATE TABLE "MasterBahan" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "type" VARCHAR(50) NOT NULL,
    "calory" DOUBLE PRECISION NOT NULL,
    "protein" DECIMAL(65,30) NOT NULL,
    "fat" DECIMAL(65,30) NOT NULL,
    "carbohydrate" DECIMAL(65,30) NOT NULL,
    "fiber" DECIMAL(65,30) NOT NULL,
    "natrium" DECIMAL(65,30) NOT NULL,
    "cholesterol" DECIMAL(65,30) NOT NULL,
    "sfa" DECIMAL(65,30) NOT NULL,
    "mufa" DECIMAL(65,30) NOT NULL,
    "pufa" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "MasterBahan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MasterBumbu" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "cooking_type" VARCHAR(50) NOT NULL,
    "calory" DOUBLE PRECISION NOT NULL,
    "protein" DECIMAL(65,30) NOT NULL,
    "fat" DECIMAL(65,30) NOT NULL,
    "carbohydrate" DECIMAL(65,30) NOT NULL,
    "fiber" DECIMAL(65,30) NOT NULL,
    "natrium" DECIMAL(65,30) NOT NULL,
    "cholesterol" DECIMAL(65,30) NOT NULL,
    "sfa" DECIMAL(65,30) NOT NULL,
    "mufa" DECIMAL(65,30) NOT NULL,
    "pufa" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "MasterBumbu_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Recipe" (
    "id" SERIAL NOT NULL,
    "menu_id" INTEGER NOT NULL,
    "item_id" INTEGER NOT NULL,
    "item_type" "RecipeItemType" NOT NULL,
    "quantity_grams" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Recipe_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Recipe_menu_id_idx" ON "Recipe"("menu_id");

-- AddForeignKey
ALTER TABLE "Recipe" ADD CONSTRAINT "Recipe_menu_id_fkey" FOREIGN KEY ("menu_id") REFERENCES "Menu"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
