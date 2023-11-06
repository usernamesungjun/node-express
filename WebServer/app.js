const express = require('express');
const session = require('express-session');
const authRoutes = require('./routes/authRoutes');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(bodyParser.json());
app.use(session({
    secret: 'your-secret-key', // 이 비밀키는 세션 ID 쿠키를 서명하는 데 사용됩니다.
    resave: false,             // 세션이 변경되지 않으면 저장소에 다시 저장하지 않음
    saveUninitialized: false,   // 새로운 세션이지만 변경되지 않은 경우 저장소에 저장하지 않음
    cookie: {
      secure: false, // true로 설정하려면 HTTPS 환경이어야 합니다.
      maxAge: 1000 * 60 * 60 * 24 // 예를 들어 쿠키 유효 기간을 1일로 설정
    }
  }));
  app.use(cors())

app.use('', authRoutes);

app.listen(3000, () => {
    console.log('Server started on port 3000');
});

module.exports = app;