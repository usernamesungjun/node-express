// test/searchUserTest.js

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app'); // 여기서 '../app'은 서버의 메인 파일 경로를 가리킵니다.
const should = chai.should();

chai.use(chaiHttp);

describe('GET /searchUsers', () => {
  it('it should GET a user by email', (done) => {
    const emailToSearch = 'zdcom211@naver.com';
    chai.request(server)
        .get('/searchUsers')
        .query({ email: emailToSearch }) // 쿼리 파라미터로 이메일을 전송합니다.
        .end((err, res) => {
          should.not.exist(err);
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('userId');
          res.body.should.have.property('name');
          res.body.should.have.property('loginId');
          res.body.loginId.should.equal(emailToSearch);
          done();
        });
  });

  it('it should not GET a user with an email that does not exist', (done) => {
    const emailToSearch = 'nonexistent@example.com';
    chai.request(server)
        .get('/searchUsers')
        .query({ email: emailToSearch })
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.be.a('object');
          res.body.should.have.property('message').eql('User not found');
          done();
        });
  });
});
