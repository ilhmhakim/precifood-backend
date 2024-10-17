import supertest from 'supertest';
import {web} from "../src/application/web";
import {logger} from "../src/application/logging";

describe('POST /api/order', () => {
    // Kasus berhasil
    it('should create a new order', async () => {
        const response = await supertest(web)
            .post("/api/order")
            .send({
                "consumer_id": "C-0192812c-2c28-7dd9-b340-cd0e0c3b7182",
                "restaurant_id": "R-01928893-0eea-711d-aa5a-684b979fff03",
                "restaurant_name": "Restoran Karimata",
                "total_price": 95000,
                "detail": [
                    {
                        "menu_id": 1,
                        "menu_name": "Nasi Putih",
                        "menu_category": "Makanan Pokok",
                        "menu_price": 5000,
                    },
                    {
                        "menu_id": 2,
                        "menu_name": "Ayam Bakar",
                        "menu_category": "Lauk Pauk",
                        "menu_price": 40000,
                    },
                    {
                        "menu_id": 3,
                        "menu_name": "Tumis Cah Kangkung",
                        "menu_category": "Sayuran",
                        "menu_price": 30000,
                    },
                    {
                        "menu_id": 4,
                        "menu_name": "Jus Jambu",
                        "menu_category": "Minuman",
                        "menu_price": 20000,
                    }
                ]
            });

        logger.debug(response.body); // Ini untuk debugging (opsional)
        expect(response.status).toBe(201); // Mengecek apakah status 201 (Created)
        expect(response.body.data.id).toBeDefined(); // Mengecek apakah id didefinisikan
        expect(response.body.data.restaurant_name).toBe("Restoran Karimata"); // Validasi nama restoran
        expect(response.body.data.total_price).toBe(95000); // Validasi total harga

        // Validasi detail order
        expect(response.body.data.order_detail).toHaveLength(4); // Memastikan jumlah detail 4
        expect(response.body.data.order_detail[0].menu_name).toBe("Nasi Putih"); // Cek menu pertama
        expect(response.body.data.order_detail[1].menu_name).toBe("Ayam Bakar"); // Cek menu kedua
        expect(response.body.data.order_detail[2].menu_price).toBe(30000); // Cek harga menu ketiga
        expect(response.body.data.order_detail[3].menu_category).toBe("Minuman"); // Cek kategori menu keempat
    });
});
