const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');

describe('BleeprBot insult routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  afterAll(() => {
    pool.end();
  });

  it('should return a random insult', async () => {
    const res = await request(app).get('/api/v1/insults');
    expect(res.body).toEqual({
      adjective_1: expect.any(String),
      adjective_2: expect.any(String),
      noun: expect.any(String),
    });
  });
});
