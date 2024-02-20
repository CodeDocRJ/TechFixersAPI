const jwt = require('jsonwebtoken');
const BlacklistedToken = require('../models/userTokenBlackList.js');

module.exports = async (req, res, next) => {

    try {
        // const token = req.header('Authorization');
        // if (!token) return res.status(401).json({ message: 'Access denied. No token provided.' });

        // // Extract the token from the authorization header
        // const tokenString = token.split(' ')[1];

        // // Check if token exists in blacklist
        // const isBlacklisted = await BlacklistedToken.exists({ token: tokenString });
        // if (isBlacklisted) {
        //     return res.status(401).json({ message: 'Token blacklisted. Please login again.' });
        // }

        // // Verify the token
        // const decoded = jwt.verify(tokenString, 'secret_key');
        // req.user = decoded;
        // next();

        const tokenWithBearer = req.header('Authorization');
        if (typeof tokenWithBearer !== 'undefined') {
            const bearer = tokenWithBearer.split(" ");
            const token = bearer[1];

            if (!token) return res.status(401).json({
                responseCode: 401,
                message: 'Access denied. No token provided.',
                error: null
            });

            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
                req.user = decoded;
                next();
            } catch (error) {
                res.status(400).json({
                    responseCode: 400,
                    message: 'Access denied with error: ' + error.message,
                });
            }
        }

    } catch (error) {
        res.status(500).json({
            responseCode: 500,
            responseMessage: 'Internal Server Error',
            error: error.message,
        });
    }
};