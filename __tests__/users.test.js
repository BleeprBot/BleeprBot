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

  it('should get a user', async () => {
    const id = 'U03BU14ULTT';
    const response = await request(app).get(`/api/v1/users/${id}`);
    expect(response.body).toEqual({ 
      id: expect.any(String), 
      slack_id: id, 
      is_admin: true 
    });
  });

  it('should insert a new user', async () => {
    const user = {
      slack_id: 'U03BU24ULTT',
      is_admin: false
    };

    const response = await request(app).post('/api/v1/users').send(user);
    expect(response.body).toEqual({
      id: expect.any(String),
      ...user
    });
  });
});
