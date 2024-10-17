import supertest from 'supertest'
import {web} from "../src/application/web";
import {logger} from "../src/application/logging";
import {UserTest} from "./test-util";
import fs from 'fs';
import path from 'path';


describe('POST /api/signup/consumer', () => {
    // Kasus berhasil
    it('should accept sign up new consumer', async () => {
        const response = await supertest(web)
            .post("/api/signup/consumer")
            .send({
                "name": "Ilham Hakim",
                "email": "test@gmail.com",
                "sex": "Laki-laki",
                "birth": "1975-09-22",
                "phone": "085812340000",
                "height": 170,
                "weight": 75,
                "no_history": true,
                "diabetes": false,
                "hypertension": false,
                "cardiovascular": false,
                "password": "abc12345",
                "password_confirmation": "abc12345"
            });

        logger.debug(response.body);
        expect(response.status).toBe(201);
        expect(response.body.message).toBeDefined();
    });

    // Kasus gagal (Input invalid)
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

    // Kasus gagal (Email telah digunakan)
    it('should reject sign up new customer if email is already taken', async () => {
        const response = await supertest(web)
            .post("/api/signup/consumer")
            .send({
                "name": "John Doe",
                "email": "test2",
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
        expect(response.status).toBe(400);
        expect(response.body.errors).toBeDefined();
    });

    // Kasus gagal (Password dan Password Confirmation tidak sama)
    it('should reject sign up new consumer if passwords are not matching', async () => {
        const response = await supertest(web)
            .post("/api/signup/consumer")
            .send({
                "name": "John Doe",
                "email": "testconsumer@gmail.com",
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
                "password_confirmation": "bac12345"
            });

        logger.debug(response.body);
        expect(response.status).toBe(400);
        expect(response.body.errors).toBeDefined();
    });
});

describe('POST /api/signup/restaurant', () => {
    // Kasus berhasil
    it('should sign up a new restaurant successfully', async () => {
        // const imagePath = path.resolve(__dirname, 'D:\\Kulliah\\Penelitian\\Precifood Backend\\src\\assets\\restaurant.jpg'); // Ganti path dengan lokasi file gambar yang sesuai

        const response = await supertest(web)
            .post('/api/signup/restaurant')
            .send({
                "name": "Restoran Karimata",
                "email": "testrestaurant@gmail.com",
                "phone": "085231004040",
                "province": "Jawa Barat",
                "city": "Bogor",
                "address": "Depan Pintu Tol Sentul Selatan-2 The Grand, Jl. Tol Lkr. Luar Bogor",
                "image": "www.example.com",
                "password": "@bc12345",
                "password_confirmation": "@bc12345"
            });
            logger.debug(response.body);
            expect(response.status).toBe(201);
            expect(response.body.message).toBeDefined();
        });
});

describe('POST /api/signup/admin', () => {
    // Kasus berhasil
    it('should sign up admin successfully', async () => {
        const response = await supertest(web)
            .post('/api/signup/admin')
            .send({
                "email": "testadmin@gmail.com",
                "password": "@bc12345",
                "password_confirmation": "@bc12345"
            });
        logger.debug(response.body);
        expect(response.status).toBe(201);
        expect(response.body.message).toBeDefined();
    });
});


describe('GET /api/users/consumer/profile', () => {
    // Kasus berhasil
    it('should return profile of a consumer when authenticated', async () => {
        const response = await supertest(web)
            .get('/api/users/consumer/profile')
            .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IkMtMDE5Mjg2ZWMtMTIzZC03NTVkLWFiNjQtZTBlNGI5YWQ0ODdjIiwiZW1haWwiOiJ0ZXN0MUBnbWFpbC5jb20iLCJyb2xlIjoiS29uc3VtZW4iLCJpc3MiOiJOb2RlLUF1dGgiLCJpYXQiOjE3MjkxMzg3NzEsImV4cCI6MTcyOTE1MzE3MX0.nkWWRioB6aWFURShKTAJf4wRraHOSMND3-fn_m_NEnA'); // Set header Authorization dengan token yang valid

        // Log response body jika diperlukan
        logger.debug(response.body);

        // Sesuaikan dengan status respons yang diharapkan dari API
        expect(response.status).toBe(200);

        // Pastikan respons body memiliki struktur yang sesuai
        expect(response.body).toBeDefined();
        expect(response.body.data).toBeDefined();
        expect(response.body.data.user).toBeDefined();
        expect(response.body.data.personal_information).toBeDefined();
        expect(response.body.data.medical_history).toBeDefined();
    });
});
