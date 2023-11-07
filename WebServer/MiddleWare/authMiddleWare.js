const jwt = require('../jwt/jwt.js'); // 앞서 제공된 JWT 처리 모듈
const userModel = require('../models/userModel');
const secretKey = require('../jwt/secretkey').secretKey;

exports.authMiddleware = async (req, res, next) => {
  const authHeader = req.headers['Authorization'];
  const accessToken = authHeader && authHeader.split(' ')[1];

  if (!accessToken) return res.sendStatus(401); // No token provided

  const decoded = await jwt.verify(accessToken);
  if (decoded === jwt.TOKEN_EXPIRED) {
    // Access Token has expired
    return res.status(401).json({ error: 'Token expired' });
  } else if (decoded === jwt.TOKEN_INVALID) {
    // Token is invalid
    return res.status(401).json({ error: 'Token invalid' });
  } else if (decoded instanceof Error) {
    // Other errors
    return res.status(400).json({ error: 'Token error' });
  }

  // If the token is valid, set the user object for the next middleware
  req.user = decoded;
  next();
};
