const request = require('supertest');
const server = require('../api/server');
const db = require('../database/dbConfig');

describe('server', () => {
  beforeEach(async () => {
    await db('users').truncate();
  });

  it('runs the tests', () => {
    expect(true).toBe(true);
  });

  describe('test env', () => {
    it('should run the testing env', () => {
      expect(process.env.DB_ENV).toBe('testing');
    });
  });

  describe('POST /api/auth/register', () => {
    it('should create a new user', () => {
      return request(server)
        .post('/api/auth/register')
        .send({ username: 'TEST', password: 'TEST' })
        .expect('Content-Type', /json/)
        .then(res => {
          console.log(res.body);
          expect(res.body.username).toEqual('TEST');
        });
    });
    it('should return status 201', () => {
      return request(server)
        .post('/api/auth/register')
        .send({ username: 'TEST', password: 'TEST' })
        .expect(201)
        .expect('Content-Type', /json/);
    });
  });
});
