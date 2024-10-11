import supertest from 'supertest'
import {web} from "../src/application/web";
import {logger} from "../src/application/logging";
import {UserTest} from "./test-util";
import bcrypt from "bcrypt";


describe('POST /api/signup/consumer', () => {
    afterEach(async () => {
        await UserTest.delete();
    })

    // Kasus Berhasil
    it('should reject sign up new consumer if request is invalid', async () => {
        const response = await supertest(web)
            .post("/api/signup/consumer")
            .send({
                "name": "John Doe",
                "email": "test",
                "sex": "Laki-laki",
                "birth": "1975-09-22",
                "phone": "085812340000",
                "height": 170,
                "weight": 75,
                "no_history": true,
                "diabetes": false,
                "hypertension": false,
                "cardiovascular": false,
                "password": "@bc12345",
                "password_confirmation": "@bc12345"
            });

        logger.debug(response.body);
        expect(response.status).toBe(201);
        expect(response.body.message).toBeDefined();
    });

    // Kasus Gagal (Input invalid)
    it('should reject sign up new consumer if request is invalid', async () => {
        const response = await supertest(web)
            .post("/api/signup/consumer")
            .send({
                "name": "John Doe",
                "email": "test",
                "sex": "Laki-laki",
                "birth": "1975-09-22",
                "phone": "085812340000",
                "height": -30,
                "weight": 75,
                "no_history": true,
                "diabetes": false,
                "hypertension": false,
                "cardiovascular": false,
                "password": "@bc12345",
                "password_confirmation": "@bc12345"
            });

        logger.debug(response.body);
        expect(response.status).toBe(400);
        expect(response.body.errors).toBeDefined();
    });
});