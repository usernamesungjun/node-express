/* const supertest = require('supertest');
const chai = require('chai');
const expect = chai.expect;
const app = require('../app'); // Adjust path as necessary

describe('User Login', () => {
  it('should log in a user and return a token', async () => {
    const response = await supertest(app)
      .post('/login') // Replace with your actual login endpoint
      .send({ loginId: 'test1', pw: 'test1234' }) // Replace with test credentials
      .expect(200);

    expect(response.body).to.have.property('jwt');
    // Store the token for future use in other tests
    global.testToken = response.body.token;
  });
});
 */