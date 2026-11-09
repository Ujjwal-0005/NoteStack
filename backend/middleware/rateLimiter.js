// backend/middleware/rateLimiter.js
const rateLimit = require('express-rate-limit');

// General API rate limiter: 100 requests per 15 minutes per IP
const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        msg: 'Too many requests from this IP, please try again after 15 minutes'
    }
});

// Strict Auth rate limiter: 10 attempts per 15 minutes on login and register
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        msg: 'Too many authentication attempts, please try again after 15 minutes'
    }
});

module.exports = {
    generalLimiter,
    authLimiter
};
