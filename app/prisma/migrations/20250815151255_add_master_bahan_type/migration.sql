-- CreateTable
CREATE TABLE "MasterBahanType" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,

    CONSTRAINT "MasterBahanType_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MasterBahanType_name_key" ON "MasterBahanType"("name");

-- Insert initial bahan types
INSERT INTO "MasterBahanType" ("name") VALUES ('Utama'), ('Pelengkap'), ('Dasar');

-- AlterTable: Add the type_id column with a default value (will be updated)
ALTER TABLE "MasterBahan" ADD COLUMN "type_id" INTEGER NOT NULL DEFAULT 1;

-- Update the type_id based on the existing type field
UPDATE "MasterBahan" SET "type_id" = (SELECT id FROM "MasterBahanType" WHERE LOWER("MasterBahanType"."name") = LOWER("MasterBahan"."type"));

-- AlterTable: Remove the default value constraint from type_id
ALTER TABLE "MasterBahan" ALTER COLUMN "type_id" DROP DEFAULT;

-- Drop the type column after the data has been migrated
ALTER TABLE "MasterBahan" DROP COLUMN "type";

-- AddForeignKey
ALTER TABLE "MasterBahan" ADD CONSTRAINT "MasterBahan_type_id_fkey" FOREIGN KEY ("type_id") REFERENCES "MasterBahanType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
