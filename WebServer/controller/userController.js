const userModel = require('../models/userModel.js')
const bcrypt = require('bcrypt');
const session = require('express-session');
const jwtHelper = require('../jwt/jwt.js')

exports.signUp = async (req, res) => {
    const { name, loginId, email, pw } = req.body;
    
    if (await userModel.isLoginIdExist(loginId, email)) {
        return res.status(400).json({ message: 'Login ID or Email already exists.' });
    }

    const hashedPassword = await bcrypt.hash(pw, 10);
    
    try {
        await userModel.createUser(loginId, name, hashedPassword, email);
        res.status(201).json({ message: 'Signup successful' });
    } catch (error) {
        res.status(500).json({ message: 'Signup failed', error });
    }
};

exports.login = async (req, res) => {
    const { loginId, pw } = req.body;
    console.log(req.body);

    const user = await userModel.findByLoginId(loginId);

    if (!user) {
        return res.status(400).json({ message: 'Invalid loginId' });
    }

    // 입력한 비밀번호와 DB에 저장된 비밀번호 해싱값 비교
    const isMatch = await userModel.comparePassword(pw, user.pw);

    if (isMatch) {
        // 토큰 생성
        const tokens = await jwtHelper.sign(user);

        res.status(200).json({
            code: 200,
            message: '토큰이 발급되었습니다.',
            jwt: tokens.accessToken,
            userId : user.userId
        });
    } else {
        return res.status(400).json({ message: 'Invalid password' });
    }
};

exports.logout = (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ message: 'Logout failed', error: err });
        }
        res.json({ message: 'Logout successful' });
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
  
      res.status(200).json({ userId: user.userId ,name: user.name, loginId:user.loginId , message:'사용자가 검색되었습니다.'});
    } catch (error) {
      res.status(500).json(error.message);
    }
};
