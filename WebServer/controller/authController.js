const userModel = require('../models/userModel')
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const session = require('express-session');

exports.signUp = async (req, res) => {
    const { loginId, name, pw, email } = req.body;
    
    if (await userModel.isUserExist(loginId, email)) {
        return res.status(400).send({ message: 'Login ID or Email already exists.' });
    }

    const hashedPassword = await bcrypt.hash(pw, 10);
    
    try {
        await userModel.createUser(loginId, name, hashedPassword, email);
        res.send({ message: 'Signup successful' });
    } catch (error) {
        res.status(500).send({ message: 'Signup failed', error });
    }
};

exports.login = async (req, res) => {
    const { loginId, pw } = req.body;
    console.log(req.body)

    // DB에서 사용자 정보 확인
    const user = await userModel.findByLoginId(loginId);

    if (!user) {
        return res.status(400).send({ message: 'Invalid loginId' });
    }

    // 입력한 비밀번호와 DB에 저장된 비밀번호 해싱값 비교
    const isMatch = await userModel.comparePassword(pw, user.pw);

    if (!isMatch) {
        return res.status(400).send({ message: 'Invalid password' });
    }

    // 세션 생성 및 10분 유지
    req.session.userId = user.id;
    req.session.cookie.maxAge = 10 * 60 * 1000; // 10분

    res.send({ message: 'Login successful', userId: user.id });
};

exports.logout = (req,res) => {
    req.session.destroy(err => {
        if(err){
            return res.status(500)
        }
    });
    res.redirect('/login');
}