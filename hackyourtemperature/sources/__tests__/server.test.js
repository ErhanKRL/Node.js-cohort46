import request from 'supertest';
import app from '../../server';


describe('Express Server', () => {
  it('responds with hello from backend to frontend! on /', async () => {
    const response = await request(app).get('/');
    expect(response.text).toEqual('hello from backend to frontend!');
    expect(response.status).toBe(200);
  });

  it('responds with weather data for a valid city name', async () => {
    const cityName = 'London';
    const response = await request(app)
      .post('/weather')
      .send({ cityName });
    expect(response.status).toBe(200);
  });

  it('responds with error for missing cityName', async () => {
    const response = await request(app).post('/weather');
    expect(response.status).toBe(400);
    expect(response.body.error).toBe("CityName is required in the request body.");
  });

});