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
      user: 'U03BU24ULTT',
      is_admin: false
    };

    const response = await request(app).post('/api/v1/users').send(user);
    expect(response.body).toEqual({
      id: expect.any(String),
      slack_id: user.user,
      is_admin: user.is_admin
    });
  });

  it('should update a non-admin user to an admin', async () => {
    const id = 'U03BHNUGSH2';

    const response = await request(app).patch(`/api/v1/users/${id}`).send();

    expect(response.body).toEqual({ id: expect.any(String), slack_id: 'U03BHNUGSH2', is_admin: true });
  });
});
