const request = require('supertest');
const chai = require('chai');
const app = require('../app.js'); // 여러분의 Express app의 경로로 수정

const expect = chai.expect;

describe('Authentication', function() {

    it('should create a session on successful login', function(done) {
        request(app)
            .post('/login')
            .send({ loginId: 'zdcom261', pw: 'test1234' }) // 예제 로그인 데이터. 실제로는 수정 필요
            .end(function(err, res) {
                expect(res.body.message).to.equal('Login successful');
                // 다른 세션에 관련된 확인 작업을 여기에 추가
                done();
            });
    });

    it('should destroy the session on logout', function(done) {
        let agent = request.agent(app); // 세션을 유지하기 위한 agent 생성

        agent
            .post('/login')
            .send({ loginId: 'zdcom261', pw: 'test1234' })
            .end(function(err, res) {
                // 로그아웃 요청 전송
                agent
                    .post('/logout')
                    .end(function(err, res) {
                        expect(res.header.location).to.equal('/login'); // 로그아웃 후 로그인 페이지로 리다이렉트
                        // 다른 세션 파기에 관련된 확인 작업을 여기에 추가
                        done();
                    });
            });
    });

});
