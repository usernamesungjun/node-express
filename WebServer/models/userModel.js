const mysql = require('mysql');
const util = require('util');
const bcrypt = require('bcrypt');

//db연결
const db = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '9568',
    database: 'collaboflow_db'
});

db.query = util.promisify(db.query);

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

exports.comparePassword = async (inputPassword, hashedPassword) => {
  return bcrypt.compare(inputPassword, hashedPassword);
};
