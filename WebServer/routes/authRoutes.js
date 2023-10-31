const express = require('express');
const authController = require('../controller/authController');

const router = express.Router();

router.post('/signup', authController.signUp);
router.post('/loginning', authController.login);
router.post('/logout', authController.logout);

module.exports = router;
