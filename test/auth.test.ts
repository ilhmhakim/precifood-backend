import supertest from 'supertest'
import {web} from "../src/application/web";
import {logger} from "../src/application/logging";

describe('POST /api/auth/login', () => {
    // Kasus berhasil
    it('should accept login request for consumer', async () => {
        const response = await supertest(web)
            .post("/api/auth/login")
            .send({
                "email": "malika@gmail.com",
                "password": "abc12345",
            });

        logger.debug(response.body);
        expect(response.status).toBe(200);
    });

    it('should accept login request for restaurant', async () => {
        const response = await supertest(web)
            .post("/api/auth/login")
            .send({
                "email": "testrestaurant2@gmail.com",
                "password": "@bc12345",
            });

        logger.debug(response.body);
        expect(response.status).toBe(200);
        expect(response.body.data.email).toBe("testrestaurant2@gmail.com");
        expect(response.body.data.id).toBeDefined();
        expect(response.body.data.role).toBe("Restoran");
        expect(response.body.data.token).toBeDefined();
    });

    it('should accept login request for admin', async () => {
        const response = await supertest(web)
            .post("/api/auth/login")
            .send({
                "email": "testadmin@gmail.com",
                "password": "@bc12345",
            });

        logger.debug(response.body);
        expect(response.status).toBe(200);
        expect(response.body.data.email).toBe("testadmin@gmail.com");
        expect(response.body.data.id).toBeDefined();
        expect(response.body.data.role).toBe("Admin");
        expect(response.body.data.token).toBeDefined();
    });
});

describe('Refresh Token', () => {
    it('should refresh token', async () => {
        const response = await supertest(web)
            .post("/api/auth/refreshtoken")
            .send({
                "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IkMtMDE5MmI4OTMtY2Y2OS03ZmZhLWIxNjEtMzhjY2MxNjAyMDMzIiwiZW1haWwiOiJtYWxpa2FAZ21haWwuY29tIiwicm9sZSI6IktvbnN1bWVuIiwiaWF0IjoxNzI5ODU1NjYxLCJleHAiOjE3MzA0NjA0NjF9.fD53o9pMpBz4_nEtULusfacvfAbY7QUKlXle0HA9wqE"
            });

        logger.debug(response.body);
        expect(response.status).toBe(201);
    });
});


describe('Logout', () => {
    it('should refresh token', async () => {
        const response = await supertest(web)
            .delete("/api/auth/logout")
            .set("Authorization", `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IkMtMDE5MmI4OTMtY2Y2OS03ZmZhLWIxNjEtMzhjY2MxNjAyMDMzIiwiZW1haWwiOiJtYWxpa2FAZ21haWwuY29tIiwicm9sZSI6IktvbnN1bWVuIiwiaWF0IjoxNzI5ODU1NzE4LCJleHAiOjE3MzAwMjg1MTh9.fb9kXdylick0aaJoabVpAyA0lu1jYPfiCvmrYwXyN6I`)

        logger.debug(response.body);
        expect(response.status).toBe(200);
    });
});


