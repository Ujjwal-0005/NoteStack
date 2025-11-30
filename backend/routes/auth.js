// backend/routes/auth.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { register, login, getProfile } = require('../controllers/authController');

// All routes are mounted under /api/users
router.post('/register', register);
router.post('/login', login);
router.get('/profile', auth, getProfile); // Protected route

module.exports = router;