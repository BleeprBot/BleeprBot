const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');

describe('BleeprBot routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  afterAll(() => {
    pool.end();
  });

  it('should insert a violation to the table', async () => {
    const violation = {
      user_id: 1,
      comment: 'Fuck you.',
      identity_attack: false,
      insult: true,
      obscene: true,
      severe_toxicity: false,
      sexually_explicit: false,
      threat: false,
      toxicity: true,
    };
      
    const res = await request(app).post('/api/v1/violations').send(violation);
      
    expect(res.body).toEqual({ id: expect.any(String), ...violation });
  });
});
