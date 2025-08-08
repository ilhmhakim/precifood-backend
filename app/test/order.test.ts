import { logger } from '../src/application/logging';
import { web } from '../src/application/web';
import supertest from 'supertest';

describe('POST /api/order', () => {
    // Kasus berhasil
    it('should create a new order', async () => {
        const response = await supertest(web)
            .post(`/api/consumers/orders/${12}`)
            .set(
                'Authorization',
                `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IkMtMDE5MmM5MjYtMTcwMS03ZGQ0LTliZTQtMTlmZTZlNzQxOWFlIiwiZW1haWwiOiJtYWxpa2FAZ21haWwuY29tIiwicm9sZSI6IktvbnN1bWVuIiwiaWF0IjoxNzMwMzgwNTg3LCJleHAiOjE3MzA1NTMzODd9.5eo_JOXbVZo9dXomarUf8ItMV58P9v_rexmPuicGWhA`
            );

        logger.debug(response.body); // Ini untuk debugging (opsional)
        // expect(response.status).toBe(201); // Mengecek apakah status 201 (Created)
        // expect(response.body.data.id).toBeDefined(); // Mengecek apakah id didefinisikan
        // expect(response.body.data.restaurant_name).toBe("Restoran Karimata"); // Validasi nama restoran
        // expect(response.body.data.total_price).toBe(95000); // Validasi total harga
        //
        // // Validasi detail order
        // expect(response.body.data.order_detail).toHaveLength(4); // Memastikan jumlah detail 4
        // expect(response.body.data.order_detail[0].menu_name).toBe("Nasi Putih"); // Cek menu pertama
        // expect(response.body.data.order_detail[1].menu_name).toBe("Ayam Bakar"); // Cek menu kedua
        // expect(response.body.data.order_detail[2].menu_price).toBe(30000); // Cek harga menu ketiga
        // expect(response.body.data.order_detail[3].menu_category).toBe("Minuman"); // Cek kategori menu keempat
    });
});

describe('Mengakses riwayat order (GET)', () => {
    it('(+) (Konsumen) Dapat mengakses seluruh order yang telah dipesan ', async () => {
        const response = await supertest(web)
            .get('/api/consumers/orders')
            .set(
                'Authorization',
                `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IkMtMDE5MmM5MjYtMTcwMS03ZGQ0LTliZTQtMTlmZTZlNzQxOWFlIiwiZW1haWwiOiJtYWxpa2FAZ21haWwuY29tIiwicm9sZSI6IktvbnN1bWVuIiwiaWF0IjoxNzMwMzgwNTg3LCJleHAiOjE3MzA1NTMzODd9.5eo_JOXbVZo9dXomarUf8ItMV58P9v_rexmPuicGWhA`
            );

        logger.debug(response.body);
    });

    it('(+) (Konsumen) Dapat mengakses seluruh order yang telah dipesan ', async () => {
        const response = await supertest(web)
            .get(`/api/consumer/orders/${2}`)
            .set(
                'Authorization',
                `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IkMtMDE5Mjk5ODQtY2JkMi03Nzc5LWI1NTItYTExMzkzOGEyMDU0IiwiZW1haWwiOiJ0ZXN0QGdtYWlsLmNvbSIsInJvbGUiOiJLb25zdW1lbiIsImlzcyI6Ik5vZGUtQXV0aCIsImlhdCI6MTcyOTM4MzQwMiwiZXhwIjoxNzI5NDI2NjAyfQ.O0eRD-VRpNvHQZn2soCpH5Fqpw9nyp5J23RKpjHNNyk`
            );

        logger.debug(response.body);
    });
});
