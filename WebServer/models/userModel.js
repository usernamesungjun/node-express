const db = require('../db.js')
const bcrypt = require('bcrypt');

//로그인Id,email이 존재하는경우
exports.isLoginIdExist = async (loginId, email) => {
  const result = await db.query('SELECT * FROM user WHERE loginId = ? OR email = ?', [loginId, email]);
  return result.length>0;
};

//회원가입
exports.createUser = async (loginId, name, hashedPassword, email) => {
  await db.query('INSERT INTO user (loginId, name, pw, email) VALUES (?, ?, ?, ?)', [loginId, name, hashedPassword, email]);
};

//로그인아이디로 user정보 찾기
exports.findByLoginId = async (loginId) => {
  const user = await db.query('SELECT * FROM user WHERE loginId = ?', [loginId]);
  return user[0];
};

//email로 user정보 찾기(pw 뺴고)
exports.findByEmail = async (email) => {
  const user = await db.query('SELECT name, loginId, userId FROM user WHERE email = ?', [email]);
  return user[0];
};

//해싱된 암호와 입력 암호 비교
exports.comparePassword = async (inputPassword, hashedPassword) => {
  return bcrypt.compare(inputPassword, hashedPassword);
};

exports.updateRefreshToken = async (loginId, refreshToken) => {
  await db.query('UPDATE user SET refreshToken = ? WHERE loginId = ?', [refreshToken, loginId]);
};

// 사용자 ID로 refreshToken을 조회하는 기능을 추가합니다.
exports.findRefreshToken = async (loginId) => {
  const result = await db.query('SELECT refreshToken FROM user WHERE loginId = ?', [loginId]);
  return result.length > 0 ? result[0].refreshToken : null;
};

//userId로 존재하는 유저인지 찾기
exports.isUserExist = async (userId) => {
  const result = await db.query('SELECT * FROM user WHERE userId = ?', [userId]);
  return result.length>0;
}