const supertest = require('supertest');
const chai = require('chai');
const expect = chai.expect;
const app = require('../app'); // Adjust this path to your Express app's entry file

// Mock data for creating a project and adding users
const projectData = {
    projectName: '프로젝트 생성 테스트중1',
    startDate: '2023-01-01',
    endDate: '2023-12-31',
    personnel: 4
};

const userData = {
    email: 'test1@naver.com'
};

const teamMembers = {
    userIds: [10, 11, 12] 
};

describe('Project and User Management', () => {
    let projectId

    it('should log in a user and return a token', async () => {
        const response = await supertest(app)
          .post('/login') // Replace with your actual login endpoint
          .send({ loginId: 'zdcom211', pw: 'test1234' }) // Replace with test credentials
          .expect(200);
    
        expect(response.body).to.have.property('jwt');
        // Store the token for future use in other tests
        token = response.body.jwt;
      });

    it('should create a new project', async () => {
        const response = await supertest(app)
            .post('/project')
            .set('Authorization', `Bearer ${token}`)
            .send(projectData)
            .expect(201);

        expect(response.body).to.have.property('projectId');
        projectId = response.body.projectId; // Save the project ID for later tests
        console.log(projectId)
    });

    it('should search for users', async () => {
        const response = await supertest(app)
            .get('/searchUsers')
            .query({ email: userData.email })
            .expect(200);

        expect(response.body).to.be.an('object');
    });

    it('should add team members to the project', async () => {
        const response = await supertest(app)
            .post(`/project/${projectId}/team`)
            .send(teamMembers)
            .expect(201);
    });
});
