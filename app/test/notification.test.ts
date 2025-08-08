import { logger } from '../src/application/logging';
import { web } from '../src/application/web';
import supertest from 'supertest';

describe('Notification Test', () => {
  it('should get all notifications', async () => {
    const response = await supertest(web).get('/api/notifications');

    logger.debug(response.body); // Ini untuk debugging (opsional)
    expect(response.status).toBe(200); // Mengecek apakah status 201 (Created)
    expect(response.body.data).toBeDefined();
  });

  it('should update notification read', async () => {
    const response = await supertest(web)
      .patch(`/api/notifications/${2}`)
      .send({
        is_read: true,
      });

    logger.debug(response.body); // Ini untuk debugging (opsional)
    expect(response.status).toBe(201); // Mengecek apakah status 201 (Created)
    expect(response.body.message).toBeDefined();
  });
});
