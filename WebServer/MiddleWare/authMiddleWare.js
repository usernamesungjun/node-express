const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');
const secretKey = require('../jwt/secretkey').secretKey;

exports.authMiddleware = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const accessToken = authHeader && authHeader.split(' ')[1];

  if (accessToken == null) return res.sendStatus(401); // No token

  try {
    const decoded = jwt.verify(accessToken, secretKey);
    req.user = decoded;
    next(); // Access token is valid
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      // Token has expired, try to refresh it
      const user = await userModel.findRefreshToken(accessToken); // Example function to find user by token
      if (!user) return res.sendStatus(403); // No user found with this token

      const refreshToken = user.refreshToken;
      if (!refreshToken) return res.sendStatus(403); // No refresh token available

      try {
        const newDecoded = jwt.verify(refreshToken, secretKey);
        const newAccessToken = jwt.sign({ id: newDecoded.id }, secretKey, { expiresIn: '1h' });
        
        // Update the user's access token in the DB if necessary
        await userModel.updateAccessToken(newDecoded.id, newAccessToken);

        req.user = newDecoded;
        req.headers['authorization'] = `Bearer ${newAccessToken}`; // Optional: Update header
        next();
      } catch {
        return res.sendStatus(403); // Refresh token invalid
      }
    } else {
      return res.sendStatus(403); // Access token invalid
    }
  }
};
