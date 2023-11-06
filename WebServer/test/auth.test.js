const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app.js'); // Express 앱을 export하는 모듈 경로
const should = chai.should();

chai.use(chaiHttp);

describe('Projects', () => {
  let token; // 인증 토큰을 저장할 변수

  // 테스트 시작 전에 로그인을 하여 토큰을 얻는 과정
  before((done) => {
    chai.request(server)
      .post('/login')
      .send({ loginId: 'zdcom261', password: 'test1234' })
      .end((err, res) => {
        res.should.have.status(200);
        token = res.body.to; // 토큰 저장
        done();
      });
  });

    describe('/POST project', () => {
      it('it should create a project with only the owner', (done) => {
        // 프로젝트 생성을 위한 요청 바디
        const project = {
          projectName: 'Test Project',
          startDate: '2023-05-01',
          endDate: '2023-05-01',
          personnel: 1 // 자기 자신만 참여
        };
  
        chai.request(server)
          .post('/projects') // 프로젝트 생성 엔드포인트
          .set('Authorization', `Bearer ${token}`) // 토큰을 헤더에 설정
          .send(project)
          .end((err, res) => {
            res.should.have.status(201); // 프로젝트 생성 시 201 상태 코드를 기대합니다.
            res.body.should.be.a('object');
            res.body.should.have.property('projectName').eql('Test Project');
            res.body.should.have.property('personnel').eql(1);
            // 기타 필요한 속성들을 검사합니다.
            done();
          });
      });
    });
  });
