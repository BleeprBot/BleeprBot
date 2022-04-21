const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const Violation = require('../lib/models/Violation');

describe('BleeprBot violation routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  afterAll(() => {
    pool.end();
  });

  it('should insert a violation to the table', async () => {
    const violation = {
      user_id: '1',
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

  it('should get list of top 3 violators', async () => {
    const expected = [
      {
        slack_id: expect.any(String),
        violations_count: expect.any(String),
      },
      {
        slack_id: expect.any(String),
        violations_count: expect.any(String),
      },
      {
        slack_id: expect.any(String),
        violations_count: expect.any(String),
      },
    ];

    const res = await request(app).get('/api/v1/violations/leaderboard');
    expect(res.body).toEqual(expected);
  });

  it('should list a specific users violations', async () => {
    const response = await request(app).get('/api/v1/violations/U03BU14ULTT');

    expect(response.body).toEqual([
      {
        id: expect.any(String),
        user_id: '1',
        comment: 'This is a rude comment',
        identity_attack: false,
        insult: true,
        obscene: true,
        severe_toxicity: false,
        sexually_explicit: false,
        threat: false,
        toxicity: true,
      },
      {
        id: expect.any(String),
        user_id: '1',
        comment: 'This is a rude comment',
        identity_attack: false,
        insult: true,
        obscene: true,
        severe_toxicity: false,
        sexually_explicit: false,
        threat: false,
        toxicity: true,
      },
      {
        id: expect.any(String),
        user_id: '1',
        comment: 'This is a rude comment',
        identity_attack: false,
        insult: true,
        obscene: true,
        severe_toxicity: false,
        sexually_explicit: false,
        threat: false,
        toxicity: true,
      },
    ]);
  });

  it('should delete a violation by the Id', async () => {
    const insertedViolation = await Violation.insert({
      user_id: '1',
      comment: 'Fuck you.',
      identity_attack: false,
      insult: true,
      obscene: true,
      severe_toxicity: false,
      sexually_explicit: false,
      threat: false,
      toxicity: true,
    });
    const res = await request(app).delete(
      `/api/v1/violations/${insertedViolation.id}`
    );

    expect(res.body).toEqual(insertedViolation);
  });
});
