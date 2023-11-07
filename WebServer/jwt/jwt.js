const randToken = require('rand-token');
const jwt = require('jsonwebtoken');
const secretKey = require('../jwt/secretkey').secretKey;
const options = require('../jwt/secretkey').option;
const TOKEN_EXPIRED = -3;
const TOKEN_INVALID = -2;

module.exports = {
    sign: async (user) => {
        /* 현재는 idx와 email을 payload로 넣었지만 필요한 값을 넣으면 됨! */
        const payload = {
            userId: user.userId,
            loginId: user.loginId,
            name: user.name,
            email: user.email,
        };
        const result = {
            //sign메소드를 통해 access token 발급!
            accessToken: jwt.sign(payload, secretKey, options)
        };
        return result;
    },
    verify: (accessToken) => {
        try {
            const payload = jwt.verify(accessToken, secretKey, options);
            return payload;
        } catch (err) {
            if (err.message === 'jwt expired') {
                console.log('expired token');
                return TOKEN_EXPIRED;
            } else if (err.message === 'invalid token') {
                console.log('invalid token');
                return TOKEN_INVALID;
            } else {
                console.log("invalid token");
                return TOKEN_INVALID;
            }
        }
    }
}