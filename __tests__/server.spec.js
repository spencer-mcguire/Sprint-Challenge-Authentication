const request = require('supertest');
const server = require('../api/server');
const db = require('../database/dbConfig');

/* 
first test = jest test and env test
Second test = register - if username exists afer creatiopn 
                    - if status is 201 Created
Third test = login - if status is 200 OK
                    - if token exists and is longer than 12 char
Fouth within third = DATA - if authenticated returns an array
                            - if status is 200 OK 
*/

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

  describe('POST /api/auth/login', () => {
    it('Should create user, then login, show jokes', async () => {
      const user = {
        username: 'PattyWack',
        password: 'PistolPeet21'
      };
      // register a new user
      let res = await request(server)
        .post('/api/auth/register')
        .send(user);
      expect(res.status).toEqual(201);
      // new user logs in
      const user_login = {
        username: 'PattyWack',
        password: 'PistolPeet21'
      };
      // login
      res = await request(server)
        .post('/api/auth/login')
        .send(user_login);
      expect(res.status).toEqual(200);
      // handle the token
      const token = res.body.token;
      expect(token.length).toBeGreaterThan(12);
      // access jokes
      res = await request(server)
        .get('/api/jokes')
        .set({ authorization: token, Accept: 'application/json' });
      expect(res.body).toBeInstanceOf(Array);
      expect(res.status).toBe(200);
    });
  });
});
