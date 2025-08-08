import { logger } from '../src/application/logging';
import { web } from '../src/application/web';
import { UserTest } from './test-util';
import supertest from 'supertest';

describe('Membuat menu oleh restoran (POST)', () => {
  // Kasus berhasil
  it('(+) (Restoran) Berhasil membuat menu saat semua data yang diisikan valid', async () => {
    const response = await supertest(web)
      .post('/api/restaurant/menu')
      .set(
        'Authorization',
        'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IlItMDE5MjljY2ItYWM3NC03NTU5LWIyZjktNTBiMmM2ZjhjMTQ3IiwiZW1haWwiOiJ0ZXN0cmVzdGF1cmFudDJAZ21haWwuY29tIiwicm9sZSI6IlJlc3RvcmFuIiwiaXNzIjoiTm9kZS1BdXRoIiwiaWF0IjoxNzI5MzAxNzQyLCJleHAiOjE3MjkzNDQ5NDJ9.lvs7Uwxqq02EpUNX0AKT_W1ujKXULWllWmH3OCjMNp4'
      )
      .send({
        name: 'Ayam Goreng Testing 2',
        category: 'Lauk Pauk',
        price: 40000,
        portion: 5,
        description: 'Ayam bakar khas Medan',
        image_url: 'www.example.com',
      });

    logger.debug(response.body);
    expect(response.status).toBe(201);
    expect(response.body.data.id).toBeDefined();
    expect(response.body.data.name).toBe('Ayam Goreng Testing 2');
    expect(response.body.data.category).toBe('Lauk Pauk');
    expect(response.body.data.price).toBe(40000);
    expect(response.body.data.portion).toBe(5);
    expect(response.body.data.description).toBe('Ayam bakar khas Medan');
    expect(response.body.data.image_url).toBeDefined();
  });
});

describe('Mengupdate menu oleh restoran (PATCH)', () => {
  it('(+) (Restoran) Berhasil mengupdate menu dengan metode patch saat semua datanya valid', async () => {
    const response = await supertest(web)
      .patch(`/api/restaurant/menu/${8}`)
      .set(
        'Authorization',
        'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IlItMDE5MjljY2ItYWM3NC03NTU5LWIyZjktNTBiMmM2ZjhjMTQ3IiwiZW1haWwiOiJ0ZXN0cmVzdGF1cmFudDJAZ21haWwuY29tIiwicm9sZSI6IlJlc3RvcmFuIiwiaXNzIjoiTm9kZS1BdXRoIiwiaWF0IjoxNzI5MzAxNzQyLCJleHAiOjE3MjkzNDQ5NDJ9.lvs7Uwxqq02EpUNX0AKT_W1ujKXULWllWmH3OCjMNp4'
      )
      .send({
        name: 'Ayam Goreng Terbaru',
        category: 'Lauk Pauk',
        price: 45000,
        portion: 5,
        description: 'Ayam bakar khas Medan',
        image_url: 'www.example.com',
      });

    logger.debug(response.body);
    expect(response.status).toBe(201);
    expect(response.body.data.id).toBeDefined();
    expect(response.body.data.name).toBe('Ayam Goreng Terbaru');
    expect(response.body.data.category).toBe('Lauk Pauk');
    expect(response.body.data.price).toBe(45000);
    expect(response.body.data.portion).toBe(5);
    expect(response.body.data.description).toBe('Ayam bakar khas Medan');
    expect(response.body.data.image_url).toBeDefined();
  });
});

describe('Delete menu yang tersedia di restaurant (DELETE)', () => {
  it('(+) (Restoran) Delete menu berhasil apabila restaurantId dan menuId sesuai', async () => {
    const response = await supertest(web)
      .delete(`/api/restaurant/menu/${8}`)
      .set(
        'Authorization',
        'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IlItMDE5MjljY2ItYWM3NC03NTU5LWIyZjktNTBiMmM2ZjhjMTQ3IiwiZW1haWwiOiJ0ZXN0cmVzdGF1cmFudDJAZ21haWwuY29tIiwicm9sZSI6IlJlc3RvcmFuIiwiaXNzIjoiTm9kZS1BdXRoIiwiaWF0IjoxNzI5MzAxNzQyLCJleHAiOjE3MjkzNDQ5NDJ9.lvs7Uwxqq02EpUNX0AKT_W1ujKXULWllWmH3OCjMNp4'
      );

    logger.debug(response.body);
    expect(response.status).toBe(200);
    expect(response.body.message).toBeDefined();
  });
});

describe('Membuat nutrisi menu oleh admin (POST)', () => {
  it('(+) (Admin) Berhasil membuat detail nutrisi menu apabila data valid', async () => {
    const response = await supertest(web)
      .post(
        `/api/restaurant/R-01929ccb-ac74-7559-b2f9-50b2c6f8c147/menu/${9}/nutrition`
      )
      .set(
        'Authorization',
        'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IkEtMDE5Mjk5ODUtY2FiNS03NzdmLWJjMmUtNDg1NTkyMjdiNDY2IiwiZW1haWwiOiJ0ZXN0YWRtaW5AZ21haWwuY29tIiwicm9sZSI6IkFkbWluIiwiaXNzIjoiTm9kZS1BdXRoIiwiaWF0IjoxNzI5MzAzMDY2LCJleHAiOjE3MjkzNDYyNjZ9.pGKftuRxlQEvsBgrSE3R0nmQNSD7c6rUOzSQXvzqzM4'
      )
      .send({
        weight_per_portion: 50,
        weight_with_bdd: 50,
        calory: 50,
        protein: 50.2,
        fat: 50.2,
        carbohydrate: 50.3,
        fiber: 50.2,
        natrium: 50.33,
        cholesterol: 50.02,
        sfa: 50,
        mufa: 50.4,
        pufa: 50.1,
      });

    logger.debug(response.body);
    expect(response.status).toBe(201);
    expect(response.body.message).toBeDefined();
    expect(response.body.data).toBeDefined();
    expect(response.body.data.nutrition).toBeDefined();
  });
});

describe('Mengupdate nutrisi pada menu spesifik (PATCH)', () => {
  // Kasus berhasil
  it('(+) (Admin) Berhasil update nutrisi menu apabila data valid', async () => {
    const response = await supertest(web)
      .patch(
        `/api/restaurant/R-01929985-2e09-7ffa-89b6-7dd808c6aec2/menu/${7}/nutrition`
      )
      .set(
        'Authorization',
        'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IkEtMDE5Mjk5ODUtY2FiNS03NzdmLWJjMmUtNDg1NTkyMjdiNDY2IiwiZW1haWwiOiJ0ZXN0YWRtaW5AZ21haWwuY29tIiwicm9sZSI6IkFkbWluIiwiaXNzIjoiTm9kZS1BdXRoIiwiaWF0IjoxNzI5MzAzMDY2LCJleHAiOjE3MjkzNDYyNjZ9.pGKftuRxlQEvsBgrSE3R0nmQNSD7c6rUOzSQXvzqzM4'
      )
      .send({
        weight_per_portion: 50,
        weight_with_bdd: 50,
        calory: 50,
        protein: 50.2,
        fat: 50.2,
        carbohydrate: 50.3,
        fiber: 50.2,
        natrium: 50.3,
        cholesterol: 50.02,
        sfa: 50,
        mufa: 50.4,
        pufa: 50.1,
      });

    logger.debug(response.body);
    expect(response.status).toBe(201);
    expect(response.body.message).toBeDefined();
    expect(response.body.data).toBeDefined();
    expect(response.body.data.nutrition).toBeDefined();
  });
});

describe('Mengupdate status pada menu oleh admin (PATCH)', () => {
  it('(+) (Admin) Berhasil update status menu apabila data valid', async () => {
    const response = await supertest(web)
      .patch(
        `/api/restaurant/R-01929985-2e09-7ffa-89b6-7dd808c6aec2/menu/${7}/status`
      )
      .set(
        'Authorization',
        'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IkEtMDE5Mjk5ODUtY2FiNS03NzdmLWJjMmUtNDg1NTkyMjdiNDY2IiwiZW1haWwiOiJ0ZXN0YWRtaW5AZ21haWwuY29tIiwicm9sZSI6IkFkbWluIiwiaXNzIjoiTm9kZS1BdXRoIiwiaWF0IjoxNzI5MzAzMDY2LCJleHAiOjE3MjkzNDYyNjZ9.pGKftuRxlQEvsBgrSE3R0nmQNSD7c6rUOzSQXvzqzM4'
      )
      .send({
        status: 'Approved',
      });

    logger.debug(response.body);
    expect(response.status).toBe(201);
    expect(response.body.message).toBeDefined();
    expect(response.body.data.status).toBe('Approved');
  });
});

describe('Mendapatkan seluruh menu (GET)', () => {
  it('(+) (Admin) Berhasil mendapatkan seluruh menu pada restoran spesifik beserta semua statusnya', async () => {
    const response = await supertest(web)
      .get(`/api/restaurant/R-01929ccb-ac74-7559-b2f9-50b2c6f8c147/menus`)
      .set(
        'Authorization',
        'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IkEtMDE5Mjk5ODUtY2FiNS03NzdmLWJjMmUtNDg1NTkyMjdiNDY2IiwiZW1haWwiOiJ0ZXN0YWRtaW5AZ21haWwuY29tIiwicm9sZSI6IkFkbWluIiwiaXNzIjoiTm9kZS1BdXRoIiwiaWF0IjoxNzI5MzAzMDY2LCJleHAiOjE3MjkzNDYyNjZ9.pGKftuRxlQEvsBgrSE3R0nmQNSD7c6rUOzSQXvzqzM4'
      );

    logger.debug(response.body);
    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
    expect(response.body.data).toBeDefined();
  });

  it('(+) (Konsumen) Berhasil mendapatkan seluruh menu pada restoran spesifik yang statusnya diapproved', async () => {
    const response = await supertest(web)
      .get(`/api/restaurant/R-01929985-2e09-7ffa-89b6-7dd808c6aec2/menus`)
      .set(
        'Authorization',
        'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IkMtMDE5Mjk5ODQtY2JkMi03Nzc5LWI1NTItYTExMzkzOGEyMDU0IiwiZW1haWwiOiJ0ZXN0QGdtYWlsLmNvbSIsInJvbGUiOiJLb25zdW1lbiIsImlzcyI6Ik5vZGUtQXV0aCIsImlhdCI6MTcyOTMwODYzNCwiZXhwIjoxNzI5MzUxODM0fQ.bIi2kbtHQLOKgjnSZS5-UMPvXwR5OXtd8tjgl5yEe-c'
      );

    logger.debug(response.body);
    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
    expect(response.body.data).toBeDefined();
  });

  it('(+) (Restoran) Berhasil mendapatkan seluruh menu yang dimilikinya', async () => {
    const response = await supertest(web)
      .get(`/api/restaurant/menus`)
      .set(
        'Authorization',
        'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IlItMDE5MjljY2ItYWM3NC03NTU5LWIyZjktNTBiMmM2ZjhjMTQ3IiwiZW1haWwiOiJ0ZXN0cmVzdGF1cmFudDJAZ21haWwuY29tIiwicm9sZSI6IlJlc3RvcmFuIiwiaXNzIjoiTm9kZS1BdXRoIiwiaWF0IjoxNzI5MzAxNzQyLCJleHAiOjE3MjkzNDQ5NDJ9.lvs7Uwxqq02EpUNX0AKT_W1ujKXULWllWmH3OCjMNp4'
      );

    logger.debug(response.body);
    expect(response.status).toBe(200);
    expect(response.body.data).toBeDefined();
  });
});

describe('Mencari menu berdasarkan nama / kategori / harga / status (GET)', () => {
  it('(+) (Admin) Berhasil mendapatkan seluruh menu pada restoran spesifik berdasarkan query', async () => {
    const response = await supertest(web)
      .get(
        `/api/restaurant/R-01929ccb-ac74-7559-b2f9-50b2c6f8c147/menus/search`
      )
      .query({
        price: 'asc',
      })
      .set(
        'Authorization',
        'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IkEtMDE5Mjk5ODUtY2FiNS03NzdmLWJjMmUtNDg1NTkyMjdiNDY2IiwiZW1haWwiOiJ0ZXN0YWRtaW5AZ21haWwuY29tIiwicm9sZSI6IkFkbWluIiwiaXNzIjoiTm9kZS1BdXRoIiwiaWF0IjoxNzI5MzAzMDY2LCJleHAiOjE3MjkzNDYyNjZ9.pGKftuRxlQEvsBgrSE3R0nmQNSD7c6rUOzSQXvzqzM4'
      );

    logger.debug(response.body);
    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
    expect(response.body.data).toBeDefined();
  });

  it('(+) (Konsumen) Berhasil mendapatkan seluruh menu pada restoran spesifik yang statusnya diapproved', async () => {
    const response = await supertest(web)
      .get(
        `/api/restaurant/R-01929ccb-ac74-7559-b2f9-50b2c6f8c147/menus/search`
      )
      .query({
        price: 'asc',
      })
      .set(
        'Authorization',
        'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IkMtMDE5Mjk5ODQtY2JkMi03Nzc5LWI1NTItYTExMzkzOGEyMDU0IiwiZW1haWwiOiJ0ZXN0QGdtYWlsLmNvbSIsInJvbGUiOiJLb25zdW1lbiIsImlzcyI6Ik5vZGUtQXV0aCIsImlhdCI6MTcyOTMyMzQ4MiwiZXhwIjoxNzI5MzY2NjgyfQ.PV82bJZrlFrRJbSwgG_YWzRW5DnBHGkrHB9Xjoo7qH0'
      );

    logger.debug(response.body);
    expect(response.status).toBe(200);
  });

  it('(+) (Restoran) Berhasil mendapatkan seluruh menu yang dimilikinya', async () => {
    const response = await supertest(web)
      .get(`/api/restaurant/menus`)
      .set(
        'Authorization',
        'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IlItMDE5MjljY2ItYWM3NC03NTU5LWIyZjktNTBiMmM2ZjhjMTQ3IiwiZW1haWwiOiJ0ZXN0cmVzdGF1cmFudDJAZ21haWwuY29tIiwicm9sZSI6IlJlc3RvcmFuIiwiaXNzIjoiTm9kZS1BdXRoIiwiaWF0IjoxNzI5MzAxNzQyLCJleHAiOjE3MjkzNDQ5NDJ9.lvs7Uwxqq02EpUNX0AKT_W1ujKXULWllWmH3OCjMNp4'
      );

    logger.debug(response.body);
    expect(response.status).toBe(200);
    expect(response.body.data).toBeDefined();
  });
});
