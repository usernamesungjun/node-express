const mysql = require('mysql')
const util = require('util');

const db = mysql.createConnection({
  host: '',
  user: 'collaboflow',
  password: 'collaboflow1234',
  database: 'collaboflow_db'
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