const express = require('express');
const session = require('express-session');
const authRoutes = require('./routes/authRoutes');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(bodyParser.json());
app.use(cors())

app.use('', authRoutes);

app.listen(3000, () => {
    console.log('Server started on port 3000');
});

module.exports = app;