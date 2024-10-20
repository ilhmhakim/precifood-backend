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
        expect(response.body.data.email).toBe("malika@gmail.com");
        expect(response.body.data.id).toBeDefined();
        expect(response.body.data.role).toBe("Konsumen");
        expect(response.body.data.token).toBeDefined();
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
