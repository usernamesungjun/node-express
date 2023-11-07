const db = require('../db.js')
const bcrypt = require('bcrypt');

exports.isUserExist = async (loginId, email) => {
  const result = await db.query('SELECT * FROM user WHERE loginId = ? OR email = ?', [loginId, email]);
  return result.length>0;
};

exports.createUser = async (loginId, name, hashedPassword, email) => {
  await db.query('INSERT INTO user (loginId, name, pw, email) VALUES (?, ?, ?, ?)', [loginId, name, hashedPassword, email]);
};

exports.findByLoginId = async (loginId) => {
  const user = await db.query('SELECT * FROM user WHERE loginId = ?', [loginId]);
  return user[0];
};

exports.findByEmail = async (email) => {
  const user = await db.query('SELECT name, loginId, userId FROM user WHERE email = ?', [email]);
  return user[0];
};

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