-- CreateTable
CREATE TABLE "Order" (
    "id" SERIAL NOT NULL,
    "consumer_id" VARCHAR(38) NOT NULL,
    "restaurant_id" VARCHAR(38) NOT NULL,
    "restaurant_name" VARCHAR(255) NOT NULL,
    "total_price" INTEGER NOT NULL,
    "ordered_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderDetail" (
    "id" SERIAL NOT NULL,
    "order_id" INTEGER NOT NULL,
    "menu_id" INTEGER NOT NULL,
    "menu_name" VARCHAR(255) NOT NULL,
    "menu_category" VARCHAR(50) NOT NULL,
    "menu_price" INTEGER NOT NULL,

    CONSTRAINT "OrderDetail_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_consumer_id_fkey" FOREIGN KEY ("consumer_id") REFERENCES "Consumer"("consumer_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderDetail" ADD CONSTRAINT "OrderDetail_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;
