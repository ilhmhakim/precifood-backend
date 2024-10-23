import supertest from 'supertest';
import { web } from "../src/application/web";
import { logger } from "../src/application/logging";

describe('Mengakses riwayat order (GET)', () => {
    it('(+) (Konsumen) Dapat mengakses seluruh order yang telah dipesan ', async () => {
        const response = await supertest(web)
            .get("/api/restaurants/R-0192b88f-c258-7bb9-a6ce-2f8e403e2885/recommendations")
            .set("Authorization", `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IkMtMDE5MmI4OTMtY2Y2OS03ZmZhLWIxNjEtMzhjY2MxNjAyMDMzIiwiZW1haWwiOiJtYWxpa2FAZ21haWwuY29tIiwicm9sZSI6IktvbnN1bWVuIiwiaXNzIjoiTm9kZS1BdXRoIiwiaWF0IjoxNzI5NjczNTYxLCJleHAiOjE3Mjk4NDYzNjF9.KR98fvEMlPW2t9l8kb7JcjnooBa_RI2NwNIaxEyC01M`)

        logger.debug(response.body);
        expect(response.body.message).toBeDefined();
    }, 10000000); // Menambahkan timeout 10 detik
});
