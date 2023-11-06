const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app'); // Express 앱을 export하는 모듈 경로
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
        validToken = res.body.token; // 유효한 토큰 저장
        done();
      });
  });

  // 유효한 토큰으로 프로젝트 생성 요청
  it('should create a project with a valid token', done => {
    const projectDetails = {
      projectName: 'New Project',
      startDate: '2023-01-01',
      endDate: '2023-12-30',
      personnel:1
    };

    chai.request(server)
      .post('/projects')
      .set('Authorization', `Bearer ${validToken}`) // 토큰 설정
      .send(projectDetails)
      .end((err, res) => {
        expect(res).to.have.status(201); // 프로젝트 생성 성공 기대
        done();
      });
  });

  // 유효하지 않은 토큰으로 프로젝트 생성 요청
  it('should not create a project with an invalid token', done => {
    const projectDetails = {
      projectName: 'New Project',
      startDate: '2023-01-01',
      endDate: '2023-12-30',
      personnel:1
    };

    chai.request(server)
      .post('/projects')
      .set('Authorization', 'Bearer invalidToken123') // 잘못된 토큰 설정
      .send(projectDetails)
      .end((err, res) => {
        expect(res).to.have.status(401); // 인증 오류 기대
        done();
      });
  });

  // 토큰 없이 프로젝트 생성 요청
  it('should not create a project without a token', done => {
    const projectDetails = {
      projectName: 'New Project',
      startDate: '2023-01-01',
      endDate: '2023-12-30',
      personnel:1
    };

    chai.request(server)
      .post('/projects')
      .send(projectDetails)
      .end((err, res) => {
        expect(res).to.have.status(401); // 인증 오류 기대
        // ... 추가적인 응답 검사
        done();
      });
  });
});
