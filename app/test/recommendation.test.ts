import { logger } from '../src/application/logging';
import { web } from '../src/application/web';
import supertest from 'supertest';

describe('Mendapatkan rekomendasi pada model (GET)', () => {
    it('(+) (Konsumen) Dapat mengakses seluruh order yang telah dipesan ', async () => {
        const response = await supertest(web)
            .post(
                '/api/restaurants/R-0192fb09-19e1-7cce-a0d9-2dbe193045e9/recommendations'
            )
            .set(
                'Authorization',
                `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IkMtMDE5MmZiMDktMTllMS03Y2NlLWEwZDktMjM1YmE3NDUyN2JjIiwiZW1haWwiOiJpbGhhbWhha2ltQGdtYWlsLmNvbSIsInJvbGUiOiJLb25zdW1lbiIsImlhdCI6MTczMTM5ODg3NywiZXhwIjoxNzMxNTcxNjc3fQ.ASVrMVRSvVZ6s3RFu9KmqkX8vyq_zLgYxXmzcczBWyY`
            );
        logger.debug(response.body);
        expect(response.body.message).toBeDefined();
    }, 10000000); // Menambahkan timeout 10 detik
});

describe('Mendapatkan list rekomendasi', () => {
    it('(+) (Konsumen) Dapat mengakses seluruh order yang telah dipesan ', async () => {
        const response = await supertest(web)
            .get(
                '/api/restaurants/R-0192fb09-19e1-7cce-a0d9-2dbe193045e9/recommendations'
            )
            .set(
                'Authorization',
                `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IkMtMDE5MmZiMDktMTllMS03Y2NlLWEwZDktMjM1YmE3NDUyN2JjIiwiZW1haWwiOiJpbGhhbWhha2ltQGdtYWlsLmNvbSIsInJvbGUiOiJLb25zdW1lbiIsImlhdCI6MTczMTM5ODg3NywiZXhwIjoxNzMxNTcxNjc3fQ.ASVrMVRSvVZ6s3RFu9KmqkX8vyq_zLgYxXmzcczBWyY`
            );
        logger.debug(response.body);
        expect(response.body.message).toBeDefined();
    }, 10000000); // Menambahkan timeout 10 detik
});

describe('Mendapatkan detail list rekomendasi', () => {
    it('(+) (Konsumen) Dapat mengakses seluruh order yang telah dipesan ', async () => {
        const response = await supertest(web)
            .get(
                `/api/restaurants/R-0192c857-35e6-7cc2-98da-46f0faf6f651/recommendations/${11}`
            )
            .set(
                'Authorization',
                `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IkMtMDE5MmM5MjYtMTcwMS03ZGQ0LTliZTQtMTlmZTZlNzQxOWFlIiwiZW1haWwiOiJtYWxpa2FAZ21haWwuY29tIiwicm9sZSI6IktvbnN1bWVuIiwiaWF0IjoxNzMwMzYwODkyLCJleHAiOjE3MzA1MzM2OTJ9.RHYyV7EDC3rh38p6T-kRN53tqtLLSxUwLdYl_0lHW_8`
            );
        logger.debug(response.body);
        expect(response.body.message).toBeDefined();
    }, 10000000); // Menambahkan timeout 10 detik
});
