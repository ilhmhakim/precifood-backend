import supertest from 'supertest';
import { web } from "../src/application/web";
import { logger } from "../src/application/logging";

describe('Mendapatkan rekomendasi pada model (GET)', () => {
    it('(+) (Konsumen) Dapat mengakses seluruh order yang telah dipesan ', async () => {
        const response = await supertest(web)
            .get("/api/restaurants/R-0192c857-35e6-7cc2-98da-46f0faf6f651/recommendations")
            .set("Authorization", `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IkMtMDE5MmM4NTctMzVlNi03Y2MyLTk4ZGEtM2Q3NmY4Mjc5NDE2IiwiZW1haWwiOiJpbGhhbWhha2ltQGdtYWlsLmNvbSIsInJvbGUiOiJLb25zdW1lbiIsImlhdCI6MTcyOTkzODEwMCwiZXhwIjoxNzMwMTEwOTAwfQ.yLhlqkeTAx6gNOkWXA5VDAyd09LKRs2Xln-_FmCLNhQ`)
        logger.debug(response.body);
        expect(response.body.message).toBeDefined();
    }, 10000000); // Menambahkan timeout 10 detik
});

describe('Mendapatkan list rekomendasi', () => {
    it('(+) (Konsumen) Dapat mengakses seluruh order yang telah dipesan ', async () => {
        const response = await supertest(web)
            .get("/api/restaurants/R-0192b88f-c258-7bb9-a6ce-2f8e403e2885/recommendations/list")
            .set("Authorization", `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IkMtMDE5MmI4OTMtY2Y2OS03ZmZhLWIxNjEtMzhjY2MxNjAyMDMzIiwiZW1haWwiOiJtYWxpa2FAZ21haWwuY29tIiwicm9sZSI6IktvbnN1bWVuIiwiaXNzIjoiTm9kZS1BdXRoIiwiaWF0IjoxNzI5NjczNTYxLCJleHAiOjE3Mjk4NDYzNjF9.KR98fvEMlPW2t9l8kb7JcjnooBa_RI2NwNIaxEyC01M`)

        logger.debug(response.body);
        expect(response.body.message).toBeDefined();
    }, 10000000); // Menambahkan timeout 10 detik
});

describe('Mendapatkan detail list rekomendasi', () => {
    it('(+) (Konsumen) Dapat mengakses seluruh order yang telah dipesan ', async () => {
        const response = await supertest(web)
            .get(`/api/restaurants/R-0192b88f-c258-7bb9-a6ce-2f8e403e2885/recommendations/list/${12137}`)
            .set("Authorization", `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IkMtMDE5MmI4OTMtY2Y2OS03ZmZhLWIxNjEtMzhjY2MxNjAyMDMzIiwiZW1haWwiOiJtYWxpa2FAZ21haWwuY29tIiwicm9sZSI6IktvbnN1bWVuIiwiaXNzIjoiTm9kZS1BdXRoIiwiaWF0IjoxNzI5NjczNTYxLCJleHAiOjE3Mjk4NDYzNjF9.KR98fvEMlPW2t9l8kb7JcjnooBa_RI2NwNIaxEyC01M`)

        logger.debug(response.body);
        expect(response.body.message).toBeDefined();
    }, 10000000); // Menambahkan timeout 10 detik
});
