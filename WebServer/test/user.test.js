// 테스트에 필요한 모듈을 불러옵니다.
const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const server = require('../app'); // 서버 애플리케이션의 진입점을 가리킵니다.

chai.use(chaiHttp);

describe('Projects API', () => {
  // 테스트를 위한 가상의 userId
  const testUserId = 5;

  // 사용자의 프로젝트를 조회하는 테스트 케이스
  it('should GET all projects of the logged-in user', (done) => {
    chai.request(server)
      .get('/getProjects')
      .query({ userId: testUserId }) // 쿼리 파라미터로 userId를 전송합니다.
      .end((err, res) => {
        if (err) {
          done(err);
        } else {
          try {
            // It's good practice to check if res.body is defined before making an assertion
            expect(res.body).to.exist;
            expect(res.body).to.be.an('array');
            done();
          } catch (error) {
            done(error);
          }
        }
      });
  });

  // 실패 케이스 테스트: 잘못된 userId로 요청을 보냈을 때
  it('should not GET projects with an invalid userId', (done) => {
    chai.request(server)
      .get('/getProjects')
      .query({ userId: 55 }) // 잘못된 userId를 전송합니다.
      .end((err, res) => {
        expect(res).to.have.status(404); // 일반적으로 잘못된 입력에 대해서는 404 상태 코드를 반환합니다.
        expect(res.body).to.have.property('message'); // 에러 메시지 속성이 있는지 확인합니다.
        done();
      });
  });

  
});
