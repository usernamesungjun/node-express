const express = require('express');
const session = require('express-session');
const authRoutes = require('./routes/authRoutes');
const bodyParser = require('body-parser');

const app = express();

app.use(express.json());
app.use(bodyParser.json());
app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 600000 // 10 minutes
    }
  }));

app.use('', authRoutes);

app.listen(3000, () => {
    console.log('Server started on port 3000');
});

module.exports = app;