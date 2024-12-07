import supertest from 'supertest'
import {web} from "../src/application/web";
import {logger} from "../src/application/logging";


describe('seed', () => {
    it('should seeds', async () => {
        const response = await supertest(web)
            .post("/api/seeds")

        logger.debug(response.body);
    }, 1000000);
});

describe('Registrasi Konsumen (POST /api/signup/consumer)', () => {
    // Kasus berhasil
    it('(+) Menerima registrasi konsumen jika seluruh data benar', async () => {
        const response = await supertest(web)
            .post("/api/signup/consumer")
            .send({
                "name": "Fix",
                "email": "testfix@gmail.com",
                "sex": "Laki-laki",
                "birth": "1975-09-11",
                "phone": "085812340000",
                "height": 170,
                "weight": 60,
                "medical_history": "diabetes",
                "password": "abc12345",
                "password_confirmation": "abc12345"
            });

        logger.debug(response.body);
        // expect(response.status).toBe(201);
        // expect(response.body.message).toBeDefined();
    });

    // Kasus gagal (Input invalid)
    it('(-) Menolak request jika data invalid', async () => {
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

    it('(-) Menolak jika email yang diregistrasi telah digunakan', async () => {
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

    it('(-) Menolak jika password dan password confirmation tidak sama', async () => {
        const response = await supertest(web)
            .post("/api/signup/consumer")
            .send({
                "name": "Fix",
                "email": "testfix@gmail.com",
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
                "password_confirmation": "abc12345"
            });

        logger.debug(response.body);
        expect(response.status).toBe(400);
        expect(response.body.errors).toBeDefined();
    });
});

describe('Registrasi Restoran (POST /api/signup/restaurant)', () => {
    // Kasus berhasil
    it('should sign up a new restaurant successfully', async () => {
        // const imagePath = path.resolve(__dirname, 'D:\\Kulliah\\Penelitian\\Precifood Backend\\src\\assets\\restaurant.jpg'); // Ganti path dengan lokasi file gambar yang sesuai

        const response = await supertest(web)
            .post('/api/signup/restaurant')
            .send({
                "name": "Restoran Test",
                "email": "testrestaurant2@gmail.com",
                "phone": "085231004040",
                "province": "Jawa Barat",
                "city": "Bogor",
                "address_detail": "Depan Pintu Tol Sentul Selatan-2 The Grand, Jl. Tol Lkr. Luar Bogor",
                "image": "www.example.com",
                "password": "@bc12345",
                "password_confirmation": "@bc12345"
            });
            logger.debug(response.body);
            expect(response.status).toBe(201);
            expect(response.body.message).toBeDefined();
        });
});

describe('Registrasi Admin (POST /api/signup/admin)', () => {
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


describe('Melihat Profile / Detail Konsumen (GET)', () => {
    // Kasus berhasil
    it('should return profile of a consumer when authenticated', async () => {
        const response = await supertest(web)
            .get('/api/users/consumers/profile')
            .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IkMtMDE5MmE3ZjgtMDhhNS03MzM2LWI5NDMtNjc1NDIxOGNlNTI4IiwiZW1haWwiOiJtYWxpa2FAZ21haWwuY29tIiwicm9sZSI6IktvbnN1bWVuIiwiaXNzIjoiTm9kZS1BdXRoIiwiaWF0IjoxNzI5Mzk1MTk4LCJleHAiOjE3Mjk1Njc5OTh9.QywCU8le0gHfct8TySSHAQe_EpQluM_6tZzfMu8Jpd0')

        logger.debug(response.body);

        expect(response.status).toBe(200);
        expect(response.body).toBeDefined();
        expect(response.body.data).toBeDefined();
        expect(response.body.data.user).toBeDefined();
        expect(response.body.data.personal_information).toBeDefined();
        expect(response.body.data.medical_history).toBeDefined();
    });

    it('should return profile of a consumer when authenticated as admin', async () => {
        const response = await supertest(web)
            .get('/api/users/consumer/C-01929984-cbd2-7779-b552-a113938a2054')
            .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IkMtMDE5MmU2YTYtYzY0ZS03OTljLTg5NTktZDZlNmE5NGIxMDUyIiwiZW1haWwiOiJhZGFtQGdtYWlsLmNvbSIsInJvbGUiOiJLb25zdW1lbiIsImlhdCI6MTczMDQ0NzQyNywiZXhwIjoxNzMwNjIwMjI3fQ.bRAiY4j7I7-MCKgQTErfIrjKIm6YRK5hbc-r5jbG744');

        logger.debug(response.body);

        expect(response.status).toBe(200);
        expect(response.body).toBeDefined();
        expect(response.body.data).toBeDefined();
        expect(response.body.data.user).toBeDefined();
        expect(response.body.data.personal_information).toBeDefined();
        expect(response.body.data.medical_history).toBeDefined();
    });
});

describe('Melihat Profile / Detail Restoran (GET)', () => {
    // Kasus berhasil
    it('(+) Melihat profile/detail restoran dari akun restoran', async () => {
        const response = await supertest(web)
            .get('/api/users/restaurants/profile')
            .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IlItMDE5MjljY2ItYWM3NC03NTU5LWIyZjktNTBiMmM2ZjhjMTQ3IiwiZW1haWwiOiJ0ZXN0cmVzdGF1cmFudDJAZ21haWwuY29tIiwicm9sZSI6IlJlc3RvcmFuIiwiaXNzIjoiTm9kZS1BdXRoIiwiaWF0IjoxNzI5MjA3NDcwLCJleHAiOjE3MjkyMjE4NzB9.bwotfFBgvfwgVJq9KOqlqs4LRBhXru9oank9XSn1Kgs'); // Set header Authorization dengan token yang valid

        logger.debug(response.body);

        expect(response.status).toBe(200);
        expect(response.body).toBeDefined();
        expect(response.body.data).toBeDefined();
        expect(response.body.data.user).toBeDefined();
        expect(response.body.data.contact).toBeDefined();
        expect(response.body.data.address).toBeDefined();
    });

    it('(+) Melihat detail/profil restoran sebagai konsumen', async () => {
        const response = await supertest(web)
            .get('/api/users/restaurants/R-01929ccb-ac74-7559-b2f9-50b2c6f8c147')
            .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IkMtMDE5MmE3ZjgtMDhhNS03MzM2LWI5NDMtNjc1NDIxOGNlNTI4IiwiZW1haWwiOiJtYWxpa2FAZ21haWwuY29tIiwicm9sZSI6IktvbnN1bWVuIiwiaXNzIjoiTm9kZS1BdXRoIiwiaWF0IjoxNzI5Mzk1MTk4LCJleHAiOjE3Mjk1Njc5OTh9.QywCU8le0gHfct8TySSHAQe_EpQluM_6tZzfMu8Jpd0'); // Set header Authorization dengan token yang valid

        logger.debug(response.body);

        expect(response.status).toBe(200);
        expect(response.body).toBeDefined();
        expect(response.body.data).toBeDefined();
        expect(response.body.data.user).toBeDefined();
        expect(response.body.data.contact).toBeDefined();
        expect(response.body.data.address).toBeDefined();
    });

    it('(+) Melihat detail/profile restoran sebagai admin', async () => {
        const response = await supertest(web)
            .get('/api/users/restaurant/R-01929985-2e09-7ffa-89b6-7dd808c6aec2')
            .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IkEtMDE5Mjk5ODUtY2FiNS03NzdmLWJjMmUtNDg1NTkyMjdiNDY2IiwiZW1haWwiOiJ0ZXN0YWRtaW5AZ21haWwuY29tIiwicm9sZSI6IkFkbWluIiwiaXNzIjoiTm9kZS1BdXRoIiwiaWF0IjoxNzI5MjA0NDgyLCJleHAiOjE3MjkyMTg4ODJ9.68wUwZTSEpK1wJpOdz982670OnJbhi8NE9_ITZh9vj0');

        logger.debug(response.body);

        expect(response.status).toBe(200);
        expect(response.body).toBeDefined();
        expect(response.body.data).toBeDefined();
        expect(response.body.data.user).toBeDefined();
        expect(response.body.data.contact).toBeDefined();
        expect(response.body.data.address).toBeDefined();
    });
});


describe('Mendapatkan Pop Up Consumer Information (GET)', () => {
    it('(+) (Konsumen) Mengembalikan sekilas data terkait personal information dan medical history', async () => {
        const response = await supertest(web)
            .get('/api/users/consumers/information')
            .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IkMtMDE5MmU2YTYtYzY0ZS03OTljLTg5NTktZDZlNmE5NGIxMDUyIiwiZW1haWwiOiJhZGFtQGdtYWlsLmNvbSIsInJvbGUiOiJLb25zdW1lbiIsImlhdCI6MTczMDQ0NzQyNywiZXhwIjoxNzMwNjIwMjI3fQ.bRAiY4j7I7-MCKgQTErfIrjKIm6YRK5hbc-r5jbG744')
        logger.debug(response.body);

        expect(response.status).toBe(200);
        expect(response.body).toBeDefined();
        expect(response.body.data).toBeDefined();
        expect(response.body.data.medical_history).toBeDefined();
        expect(response.body.data.personal_information).toBeDefined();
    });
});

describe('Mendapatkan seluruh list pengguna konsumen sebagai admin (GET)', () => {
    it('(+) (Admin) Mengembalikan data konsumen berupa id, nama, dan email', async () => {
        const response = await supertest(web)
            .get('/api/users/consumers')
            .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IkEtMDE5Mjk5ODUtY2FiNS03NzdmLWJjMmUtNDg1NTkyMjdiNDY2IiwiZW1haWwiOiJ0ZXN0YWRtaW5AZ21haWwuY29tIiwicm9sZSI6IkFkbWluIiwiaXNzIjoiTm9kZS1BdXRoIiwiaWF0IjoxNzI5MjM4ODg0LCJleHAiOjE3MjkyODIwODR9.lnCUkRTEN15jXan9e1CYFzuM59PumPPo8ycPIx2BLH8');

        logger.debug(response.body);

        expect(response.status).toBe(200);
        expect(response.body).toBeDefined();
        expect(response.body.data).toBeDefined();
    });
});

describe('Mendapatkan seluruh list pengguna restoran sebagai admin (GET)', () => {
    it('(+) (Admin) Mengembalikan data konsumen berupa id, nama, dan email', async () => {
        const response = await supertest(web)
            .get('/api/users/restaurants')
            .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IkEtMDE5Mjk5ODUtY2FiNS03NzdmLWJjMmUtNDg1NTkyMjdiNDY2IiwiZW1haWwiOiJ0ZXN0YWRtaW5AZ21haWwuY29tIiwicm9sZSI6IkFkbWluIiwiaXNzIjoiTm9kZS1BdXRoIiwiaWF0IjoxNzI5MjM4ODg0LCJleHAiOjE3MjkyODIwODR9.lnCUkRTEN15jXan9e1CYFzuM59PumPPo8ycPIx2BLH8');

        logger.debug(response.body);

        expect(response.status).toBe(200);
        expect(response.body).toBeDefined();
        expect(response.body.data).toBeDefined();
    });
});


describe('Konsumen dapat mengupdate profilenya (PATCH)', () => {
    it('(+) (Konsumen) Mengupdate profile milik pribadi', async () => {
        const response = await supertest(web)
            .patch('/api/users/consumers/profile')
            .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IkMtMDE5MmE3ZjgtMDhhNS03MzM2LWI5NDMtNjc1NDIxOGNlNTI4IiwiZW1haWwiOiJtYWxpa2FAZ21haWwuY29tIiwicm9sZSI6IktvbnN1bWVuIiwiaXNzIjoiTm9kZS1BdXRoIiwiaWF0IjoxNzI5Mzk1MTk4LCJleHAiOjE3Mjk1Njc5OTh9.QywCU8le0gHfct8TySSHAQe_EpQluM_6tZzfMu8Jpd0')
            .send({
                "name": "Malika Sejati",
                "birth": "1975-09-30",
                "diabetes": true
            })
        logger.debug(response.body);

        expect(response.status).toBe(201);
        expect(response.body).toBeDefined();
        expect(response.body.data).toBeDefined();
        expect(response.body.data.user).toBeDefined();
        expect(response.body.data.personal_information).toBeDefined();
        expect(response.body.data.personal_information.name).toBe("Malika Sejati");
        expect(response.body.data.medical_history).toBeDefined();
    });

    it('(+) (Konsumen) Mengupdate salah satu kondisi riwayat kesehatan menjadi true, maka lainnya akan false', async () => {
        const response = await supertest(web)
            .patch('/api/users/consumers/profile')
            .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IkMtMDE5MmU2YTYtYzY0ZS03OTljLTg5NTktZDZlNmE5NGIxMDUyIiwiZW1haWwiOiJhZGFtQGdtYWlsLmNvbSIsInJvbGUiOiJLb25zdW1lbiIsImlhdCI6MTczMDQ0NzQyNywiZXhwIjoxNzMwNjIwMjI3fQ.bRAiY4j7I7-MCKgQTErfIrjKIm6YRK5hbc-r5jbG744')
            .send({
                "hypertension": true,
            })
        logger.debug(response.body);

        expect(response.status).toBe(201);
        expect(response.body).toBeDefined();
    });
});

