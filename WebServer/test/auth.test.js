const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app.js'); // Express 앱을 export하는 모듈 경로
const expect = chai.expect;

chai.use(chaiHttp);

describe('Project Creation with Token Verification', () => {
  let validToken;

  // 로그인하여 유효한 토큰을 얻는 부분
  before(done => {
    chai.request(server)
      .post('/login')
      .send({ loginId: 'zdcom211', pw: 'test1234' })
      .end((err, res) => {
        expect(res).to.have.status(200);
        validToken = res.body.jwt; // 유효한 토큰 저장
        done();
      });
  });

  // 유효한 토큰으로 프로젝트 생성 요청
  it('should create a project with a valid token', done => {
    const projectDetails = {
      projectName: 'test2',
      startDate: '2023-01-01',
      endDate: '2023-12-31',
      personnel:1
    };

    chai.request(server)
      .post('/creatProjects')
      .set('Authorization',`Bearer ${validToken}`) // 토큰 설정
      .send(projectDetails)
      .end((err, res) => {
        expect(res).to.have.status(201); // 프로젝트 생성 성공 기대
        done();
      });
  });
});
