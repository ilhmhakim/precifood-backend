import supertest from 'supertest';
import { web } from "../src/application/web";
import { logger } from "../src/application/logging";

describe('Mendapatkan rekomendasi pada model (GET)', () => {
    it('(+) (Konsumen) Dapat mengakses seluruh order yang telah dipesan ', async () => {
        const response = await supertest(web)
            .post("/api/restaurants/R-0192c857-35e6-7cc2-98da-46f0faf6f651/recommendations")
            .set("Authorization", `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IkMtMDE5MmM4NTctMzVlNi03Y2MyLTk4ZGEtM2Q3NmY4Mjc5NDE2IiwiZW1haWwiOiJpbGhhbWhha2ltQGdtYWlsLmNvbSIsInJvbGUiOiJLb25zdW1lbiIsImlhdCI6MTcyOTkzODEwMCwiZXhwIjoxNzMwMTEwOTAwfQ.yLhlqkeTAx6gNOkWXA5VDAyd09LKRs2Xln-_FmCLNhQ`)
        logger.debug(response.body);
        expect(response.body.message).toBeDefined();
    }, 10000000); // Menambahkan timeout 10 detik
});

describe('Mendapatkan list rekomendasi', () => {
    it('(+) (Konsumen) Dapat mengakses seluruh order yang telah dipesan ', async () => {
        const response = await supertest(web)
            .get("/api/restaurants/R-0192c857-35e6-7cc2-98da-46f0faf6f651/recommendations")
            .set("Authorization", `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IkMtMDE5MmM5MjYtMTcwMS03ZGQ0LTliZTQtMTlmZTZlNzQxOWFlIiwiZW1haWwiOiJtYWxpa2FAZ21haWwuY29tIiwicm9sZSI6IktvbnN1bWVuIiwiaWF0IjoxNzMwMTcyMzMyLCJleHAiOjE3MzAzNDUxMzJ9._2Q7qMrhs2Jx8DBtxAuWCqF8hCtm9KEBbGUEdZm1Kck`)
        logger.debug(response.body);
        expect(response.body.message).toBeDefined();
    }, 10000000); // Menambahkan timeout 10 detik
});

describe('Mendapatkan detail list rekomendasi', () => {
    it('(+) (Konsumen) Dapat mengakses seluruh order yang telah dipesan ', async () => {
        const response = await supertest(web)
            .get(`/api/restaurants/R-0192c857-35e6-7cc2-98da-46f0faf6f651/recommendations/${11}`)
            .set("Authorization", `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IkMtMDE5MmM5MjYtMTcwMS03ZGQ0LTliZTQtMTlmZTZlNzQxOWFlIiwiZW1haWwiOiJtYWxpa2FAZ21haWwuY29tIiwicm9sZSI6IktvbnN1bWVuIiwiaWF0IjoxNzMwMzYwODkyLCJleHAiOjE3MzA1MzM2OTJ9.RHYyV7EDC3rh38p6T-kRN53tqtLLSxUwLdYl_0lHW_8`)
        logger.debug(response.body);
        expect(response.body.message).toBeDefined();
    }, 10000000); // Menambahkan timeout 10 detik
});
