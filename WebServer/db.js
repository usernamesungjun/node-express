const mysql = require('mysql')
const util = require('util');

const db = mysql.createConnection({
  host: '14.46.126.22', //각자 ip주소 검색 cmd -> ipconfig 명령어 입력 -> IPv4 주소 입력
  port : '3306',
  user: 'newuser',
  password: 'user1234',
  database: 'collaboflow_db',
  connectionLiimit : 30
});

db.connect((error) => {
  if (error) {
      console.error('Database connection failed:', error.stack);
      return;
  }
  console.log('Connected to the database.');
});

db.query = util.promisify(db.query);


module.exports = db;