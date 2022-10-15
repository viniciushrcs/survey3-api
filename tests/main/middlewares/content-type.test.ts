import request from 'supertest';
import app from '../../../src/main/config/app';

describe('ContentType Middleware', () => {
  test('Should return default type as json', async () => {
    app.post('/test_content_type', (req, res) => {
      res.send('');
    });

    await request(app)
      .post('/test_content_type')
      .expect('content-type', /json/);
  });
});
