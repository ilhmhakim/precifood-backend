import {UserTest} from "./test-util";
import supertest from "supertest";
import {web} from "../src/application/web";
import {logger} from "../src/application/logging";

describe('Membuat menu oleh restoran (POST)', () => {
    // Kasus berhasil
    it('(+) (Restoran) Berhasil membuat menu saat semua data yang diisikan valid', async () => {
        const response = await supertest(web)
            .post("/api/menu")
            .set("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IlItMDE5MjljY2ItYWM3NC03NTU5LWIyZjktNTBiMmM2ZjhjMTQ3IiwiZW1haWwiOiJ0ZXN0cmVzdGF1cmFudDJAZ21haWwuY29tIiwicm9sZSI6IlJlc3RvcmFuIiwiaXNzIjoiTm9kZS1BdXRoIiwiaWF0IjoxNzI5MzAxNzQyLCJleHAiOjE3MjkzNDQ5NDJ9.lvs7Uwxqq02EpUNX0AKT_W1ujKXULWllWmH3OCjMNp4")
            .send({
                "name": "Ayam Goreng",
                "category": "Lauk Pauk",
                "price": 40000,
                "portion": 5,
                "description": "Ayam bakar khas Medan",
                "image_url": "www.example.com"
            });

        logger.debug(response.body);
        expect(response.status).toBe(201);
        expect(response.body.data.id).toBeDefined();
        expect(response.body.data.name).toBe("Ayam Goreng");
        expect(response.body.data.category).toBe("Lauk Pauk");
        expect(response.body.data.price).toBe(40000);
        expect(response.body.data.portion).toBe(5);
        expect(response.body.data.description).toBe("Ayam bakar khas Medan");
        expect(response.body.data.image_url).toBeDefined();
    });
});

describe('Mengupdate menu oleh restoran (PATCH)', () => {
    it('(+) (Restoran) Berhasil mengupdate menu dengan metode patch saat semua datanya valid', async () => {
        const response = await supertest(web)
            .patch(`/api/menu/${8}`)
            .set("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IlItMDE5MjljY2ItYWM3NC03NTU5LWIyZjktNTBiMmM2ZjhjMTQ3IiwiZW1haWwiOiJ0ZXN0cmVzdGF1cmFudDJAZ21haWwuY29tIiwicm9sZSI6IlJlc3RvcmFuIiwiaXNzIjoiTm9kZS1BdXRoIiwiaWF0IjoxNzI5MzAxNzQyLCJleHAiOjE3MjkzNDQ5NDJ9.lvs7Uwxqq02EpUNX0AKT_W1ujKXULWllWmH3OCjMNp4")
            .send({
                "name": "Ayam Goreng Terbaru",
                "category": "Lauk Pauk",
                "price": 45000,
                "portion": 5,
                "description": "Ayam bakar khas Medan",
                "image_url": "www.example.com"
            });

        logger.debug(response.body);
        expect(response.status).toBe(201);
        expect(response.body.data.id).toBeDefined();
        expect(response.body.data.name).toBe("Ayam Goreng Terbaru");
        expect(response.body.data.category).toBe("Lauk Pauk");
        expect(response.body.data.price).toBe(45000);
        expect(response.body.data.portion).toBe(5);
        expect(response.body.data.description).toBe("Ayam bakar khas Medan");
        expect(response.body.data.image_url).toBeDefined();
    });
});

describe('DELETE /api/menu/:menuId', () => {
    // Kasus berhasil

    it('should accept sign up new consumer', async () => {
        const response = await supertest(web)
            .delete(`/api/menu/${8}`)
            .set("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IlItMDE5MjljY2ItYWM3NC03NTU5LWIyZjktNTBiMmM2ZjhjMTQ3IiwiZW1haWwiOiJ0ZXN0cmVzdGF1cmFudDJAZ21haWwuY29tIiwicm9sZSI6IlJlc3RvcmFuIiwiaXNzIjoiTm9kZS1BdXRoIiwiaWF0IjoxNzI5MzAxNzQyLCJleHAiOjE3MjkzNDQ5NDJ9.lvs7Uwxqq02EpUNX0AKT_W1ujKXULWllWmH3OCjMNp4")

        logger.debug(response.body);
        expect(response.status).toBe(200);
        expect(response.body.message).toBeDefined();
    });
});

describe('POST /api/menu/:menuId/nutrition', () => {
    // Kasus berhasil

    it('should accept sign up new consumer', async () => {
        const response = await supertest(web)
            .post(`/api/restaurant/R-01929985-2e09-7ffa-89b6-7dd808c6aec2/menu/${7}/nutrition`)
            .set("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IkEtMDE5Mjk5ODUtY2FiNS03NzdmLWJjMmUtNDg1NTkyMjdiNDY2IiwiZW1haWwiOiJ0ZXN0YWRtaW5AZ21haWwuY29tIiwicm9sZSI6IkFkbWluIiwiaXNzIjoiTm9kZS1BdXRoIiwiaWF0IjoxNzI5MzAzMDY2LCJleHAiOjE3MjkzNDYyNjZ9.pGKftuRxlQEvsBgrSE3R0nmQNSD7c6rUOzSQXvzqzM4")
            .send({
                "weight_per_portion": 50,
                "weight_with_bdd": 50,
                "calory": 50,
                "protein": 50.2,
                "fat": 50.2,
                "carbohydrate": 50.3,
                "fiber": 50.2,
                "natrium": 50.33,
                "cholesterol": 50.02,
                "sfa": 50,
                "mufa": 50.4,
                "pufa": 50.1
            });

        logger.debug(response.body);
        expect(response.status).toBe(201);
        expect(response.body.message).toBeDefined();
        expect(response.body.data).toBeDefined();
        expect(response.body.data.nutrition).toBeDefined();
    });
});

describe('PUT /api/menu/:menuId/nutrition', () => {

    // Kasus berhasil
    it('should accept sign up new consumer', async () => {
        const response = await supertest(web)
            .patch(`/api/restaurant/R-01929985-2e09-7ffa-89b6-7dd808c6aec2/menu/${7}/nutrition`)
            .set("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IkEtMDE5Mjk5ODUtY2FiNS03NzdmLWJjMmUtNDg1NTkyMjdiNDY2IiwiZW1haWwiOiJ0ZXN0YWRtaW5AZ21haWwuY29tIiwicm9sZSI6IkFkbWluIiwiaXNzIjoiTm9kZS1BdXRoIiwiaWF0IjoxNzI5MzAzMDY2LCJleHAiOjE3MjkzNDYyNjZ9.pGKftuRxlQEvsBgrSE3R0nmQNSD7c6rUOzSQXvzqzM4")
            .send({
                "weight_per_portion": 50,
                "weight_with_bdd": 50,
                "calory": 50,
                "protein": 50.2,
                "fat": 50.2,
                "carbohydrate": 50.3,
                "fiber": 50.2,
                "natrium": 50.30,
                "cholesterol": 50.02,
                "sfa": 50,
                "mufa": 50.4,
                "pufa": 50.1
            });

        logger.debug(response.body);
        expect(response.status).toBe(201);
        expect(response.body.message).toBeDefined();
        expect(response.body.data).toBeDefined();
        expect(response.body.data.nutrition).toBeDefined();
    });
});

describe('PATCH /api/menu/:menuId/nutrition', () => {
    // Kasus berhasil
    it('should accept sign up new consumer', async () => {
        const response = await supertest(web)
            .patch(`/api/restaurant/R-01929985-2e09-7ffa-89b6-7dd808c6aec2/menu/${7}/status`)
            .set("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IkEtMDE5Mjk5ODUtY2FiNS03NzdmLWJjMmUtNDg1NTkyMjdiNDY2IiwiZW1haWwiOiJ0ZXN0YWRtaW5AZ21haWwuY29tIiwicm9sZSI6IkFkbWluIiwiaXNzIjoiTm9kZS1BdXRoIiwiaWF0IjoxNzI5MzAzMDY2LCJleHAiOjE3MjkzNDYyNjZ9.pGKftuRxlQEvsBgrSE3R0nmQNSD7c6rUOzSQXvzqzM4")
            .send({
                "status": "Rejected"
            });

        logger.debug(response.body);
        expect(response.status).toBe(201);
        expect(response.body.message).toBeDefined();
        expect(response.body.data.status).toBe("Rejected");
    });
});
