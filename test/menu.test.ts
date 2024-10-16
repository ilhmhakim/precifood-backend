import {UserTest} from "./test-util";
import supertest from "supertest";
import {web} from "../src/application/web";
import {logger} from "../src/application/logging";

describe('POST /api/menu', () => {
    // Kasus berhasil
    it('should accept sign up new consumer', async () => {
        const response = await supertest(web)
            .post("/api/menu")
            .send({
                "restaurant_id": "R-01928893-0eea-711d-aa5a-684b979fff03",
                "name": "Ayam Taliwangsss",
                "category": "Lauk Pauk",
                "price": 40000,
                "portion": 5,
                "description": "Ayam bakar khas Medan",
                "image_url": "www.example.com"
            });

        logger.debug(response.body);
        expect(response.status).toBe(201);
        expect(response.body.data.id).toBeDefined();
        expect(response.body.data.name).toBe("Ayam Taliwangsss");
        expect(response.body.data.category).toBe("Lauk Pauk");
        expect(response.body.data.price).toBe(40000);
        expect(response.body.data.portion).toBe(5);
        expect(response.body.data.description).toBe("Ayam bakar khas Medan");
        expect(response.body.data.image_url).toBeDefined();
    });
});

describe('PUT /api/menu/:menuId', () => {
    // Kasus berhasil

    it('should accept sign up new consumer', async () => {
        const response = await supertest(web)
            .put(`/api/menu/${3}`)
            .send({
                "restaurant_id": "R-01928893-0eea-711d-aa5a-684b979fff03",
                "name": "Ayam Taliwangan",
                "category": "Lauk Pauk",
                "price": 40000,
                "portion": 5,
                "description": "Ayam bakar khas Medan",
                "image_url": "www.example.com"
            });

        logger.debug(response.body);
        expect(response.status).toBe(201);
        expect(response.body.data.id).toBeDefined();
        expect(response.body.data.name).toBe("Ayam Taliwangan");
        expect(response.body.data.category).toBe("Lauk Pauk");
        expect(response.body.data.price).toBe(40000);
        expect(response.body.data.portion).toBe(5);
        expect(response.body.data.description).toBe("Ayam bakar khas Medan");
        expect(response.body.data.image_url).toBeDefined();
    });
});

describe('DELETE /api/menu/:menuId', () => {
    // Kasus berhasil

    it('should accept sign up new consumer', async () => {
        const response = await supertest(web)
            .delete(`/api/menu/${3}`)
            .send({
                "restaurant_id": "R-01928893-0eea-711d-aa5a-684b979fff03",
            });

        logger.debug(response.body);
        expect(response.status).toBe(200);
        expect(response.body.message).toBeDefined();
    });
});

describe('POST /api/menu/:menuId/nutrition', () => {
    // Kasus berhasil

    it('should accept sign up new consumer', async () => {
        const response = await supertest(web)
            .post(`/api/menu/${4}/nutrition`)
            .send({
                weight_per_portion: 50,
                calory: 50,
                protein: 50,
                fat: 50,
                carbohydrate: 50,
                sodium: 50,
                cholesterol: 50,
                sfa: 50,
                mufa: 50,
                pufa: 50
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
            .put(`/api/menu/${4}/nutrition`)
            .send({
                weight_per_portion: 60,
                calory: 50,
                protein: 50,
                fat: 50,
                carbohydrate: 50,
                sodium: 50,
                cholesterol: 50,
                sfa: 50,
                mufa: 50,
                pufa: 50
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
            .patch(`/api/menu/${4}/status`)
            .send({
                "status": "Approved"
            });

        logger.debug(response.body);
        expect(response.status).toBe(201);
        expect(response.body.message).toBeDefined();
        expect(response.body.data.status).toBe("Approved");
    });
});
