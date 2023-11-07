const userModel = require('../models/userModel.js')
const bcrypt = require('bcrypt');
const session = require('express-session');
const jwtHelper = require('../jwt/jwt.js')

exports.signUp = async (req, res) => {
    const { name, loginId, email, pw } = req.body;
    console.log(req.body);
    
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
    console.log(req.body);

    const user = await userModel.findByLoginId(loginId);

    if (!user) {
        return res.status(400).send({ message: 'Invalid loginId' });
    }

    // 입력한 비밀번호와 DB에 저장된 비밀번호 해싱값 비교
    const isMatch = await userModel.comparePassword(pw, user.pw);

    if (isMatch) {
        // 토큰 생성
        const tokens = await jwtHelper.sign(user);
        
        res.cookie('jwt',tokens)
        res.status(200).send({
            code: 200,
            message: '토큰이 발급되었습니다.',
            jwt: tokens.accessToken
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


exports.searchUsers = async (req, res) => {
    try {
      // 사용자 검색 로직
      const { email } = req.query;
      console.log(email)
  
      // UserModel.findByLoginId 함수를 호출하여 사용자를 찾습니다.
      const user = await userModel.findByEmail(email);
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.json({ userId: user.userId ,name: user.name, loginId:user.loginId });
    } catch (error) {
      res.status(500).send(error.message);
    }
  };