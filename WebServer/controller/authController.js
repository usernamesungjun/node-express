const userModel = require('../models/userModel.js')
const bcrypt = require('bcrypt');
const session = require('express-session');
const jwtHelper = require('../jwt/jwt.js')

exports.signUp = async (req, res) => {
    const { name, loginId, email, pw } = req.body;
    
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

    const user = await userModel.findByLoginId(loginId);

    if (!user) {
        return res.status(400).send({ message: 'Invalid loginId' });
    }

    // 입력한 비밀번호와 DB에 저장된 비밀번호 해싱값 비교
    const isMatch = await userModel.comparePassword(pw, user.pw);

    if (isMatch) {
        // 토큰 생성
        const tokens = await jwtHelper.sign(user);

        // refreshToken을 데이터베이스에 저장
        await userModel.updateRefreshToken(user.loginId, tokens.refreshToken);

        // accessToken과 refreshToken을 클라이언트에 전송
        req.session.userId = user.userId; // 이렇게 하면 세션에 userId가 저장됩니다.
        req.session.isLoggedIn = true; // 사용자의 로그인 상태를 저장합니다.
        res.send({
            message: 'Login successful',
            accessToken: tokens.token,
            refreshToken: tokens.refreshToken
        });
    } else {
        return res.status(400).send({ message: 'Invalid password' });
    }
};

exports.logout = (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).send({ message: 'Logout failed', error: err });
        }
        res.send({ message: 'Logout successful' });
    });
};