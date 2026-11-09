// backend/routes/auth.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const validate = require('../middleware/validate');
const { authLimiter } = require('../middleware/rateLimiter');
const { registerSchema, loginSchema } = require('../validation/schemas');
const { register, login, getProfile } = require('../controllers/authController');

// All routes are mounted under /api/users
router.post('/register', authLimiter, validate(registerSchema), register);
router.post('/login', authLimiter, validate(loginSchema), login);
router.get('/profile', auth, getProfile); // Protected route

module.exports = router;