const express = require('express');
const authController = require('../controller/authController');
const projectController = require('../controller/projectController');
const authMiddleware = require('../MiddleWare/authMiddleWare.js')

const router = express.Router();

router.post('/register', authController.signUp);
router.post('/login', authController.login);
router.post('/logout', authController.logout);

router.post('/projects',authMiddleware.authMiddleware ,projectController.createProject);

module.exports = router;
