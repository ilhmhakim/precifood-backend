import supertest from 'supertest'
import {web} from "../src/application/web";
import {logger} from "../src/application/logging";
import {UserTest} from "./test-util";
import fs from 'fs';
import path from 'path';


describe('POST /api/auth/login', () => {
    // Kasus berhasil
    it('should accept login request', async () => {
        const response = await supertest(web)
            .post("/api/auth/login")
            .send({
                "email": "test1@gmail.com",
                "password": "@bc12345",
            });

        logger.debug(response.body);
        expect(response.status).toBe(200);
        expect(response.body.data.email).toBe("test1@gmail.com");
        expect(response.body.data.id).toBeDefined();
        expect(response.body.data.role).toBe("Konsumen");
        expect(response.body.data.token).toBeDefined();
    });
});