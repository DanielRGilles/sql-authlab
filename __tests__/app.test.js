require('dotenv').config();

const { execSync } = require('child_process');

const fakeRequest = require('supertest');
const app = require('../lib/app');
const client = require('../lib/client');

describe('app routes', () => {
  describe('routes', () => {
    let token;
  
    beforeAll(async () => {
      execSync('npm run setup-db');
  
      await client.connect();
      const signInData = await fakeRequest(app)
        .post('/auth/signup')
        .send({
          email: 'jon@user.com',
          password: '1234'
        });
      
      token = signInData.body.token; // eslint-disable-line
    }, 10000);
  
    afterAll(done => {
      return client.end(done);
    });

    test('creates todos', async() => {

      const expectation = [
        { 
          'id': expect.any(Number),
          'todo': expect.any(String),
          'completed': expect.any(Boolean),
          'user_id': expect.any(Number)

        }
      ];
      const data = await fakeRequest(app)
        .post('/api/todos')
        .send({
          todo: 'Wash Car',
          completed: false,
          user_id: 1
        })
        .expect('Content-Type', /json/)
        .set('Authorization', token)
        .expect(200);
      console.log(data);
      const expectedTodo = await fakeRequest(app)
        .get('/api/todos')
        .expect('Content-Type', /json/)
        .set('Authorization', token)
        .expect(200); 
      
      expect(expectedTodo.body).toEqual(expectation);
    });
    
    test('returns todos', async() => {

      const expectation = [
        { 
          'id': expect.any(Number),
          'todo': expect.any(String),
          'completed': expect.any(Boolean),
          'user_id': expect.any(Number)

        }
      ];

      const data = await fakeRequest(app)
        .get('/api/todos')
        .expect('Content-Type', /json/)
        .set('Authorization', token)
        .expect(200);

      expect(data.body).toEqual(expectation);
    });
    test('creates todos', async() => {

      const expectation = [
        { 
          'id': expect.any(Number),
          'todo': expect.any(String),
          'completed': true,
          'user_id': expect.any(Number)

        }
      ];
      const data = await fakeRequest(app)
        .put('/api/todos/5')
        .send({
          todo: 'Wash Car',
          completed: true,
          user_id: 1
        })
        .expect('Content-Type', /json/)
        .set('Authorization', token)
        .expect(200);
      console.log(data);
      const expectedTodo = await fakeRequest(app)
        .get('/api/todos')
        .expect('Content-Type', /json/)
        .set('Authorization', token)
        .expect(200); 
      
      expect(expectedTodo.body).toEqual(expectation);
    });
    
  });
});
