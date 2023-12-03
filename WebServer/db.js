const mysql = require('mysql')
const util = require('util');

const db = mysql.createConnection({
  host: '14.46.126.22', 
  port : '3306',
  user: 'collaboflow',
  password: 'user!123',
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