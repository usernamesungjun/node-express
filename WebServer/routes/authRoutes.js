const express = require('express');
const userController = require('../controller/userController.js');
const projectController = require('../controller/projectController');
const workController = require('../controller/workController.js')
const mentionController = require('../controller/mentionController.js')
const authMiddleware = require('../MiddleWare/authMiddleWare.js')

const router = express.Router();

//http://localhost:3000

//유저관련
router.post('/register', userController.signUp);
router.post('/login', userController.login);
router.post('/logout', userController.logout);

//유저검색
router.get('/searchUsers', userController.searchUsers);
//팀원추가
router.post('/project/:projectId/team',projectController.registerTeam);

//프로젝트 
router.post('/project', projectController.createProject); //생성
router.get('/projects', projectController.getUserProjects);//조회
router.put('/project/:projectId',projectController.updateProject)//수정
router.delete('/project/:projectId')//삭제


//작업
router.post('/project/work', workController.createWork); //생성
router.get('/project/works', workController.getProjectWork); //조회
router.put('/project/:projectId/work/:workId',workController.updateProjectWork)//수정
router.delete('/project/work/:workId',workController.deleteWork)//삭제

//멘션
router.post('/project/work/mention',mentionController.createMention)//생성
router.put('/project/work/:workId/mention/:mentionId', mentionController.updateMention)//수정
router.delete('/project/work/mention/:mentionId',mentionController.deleteMention)//삭제


module.exports = router;
