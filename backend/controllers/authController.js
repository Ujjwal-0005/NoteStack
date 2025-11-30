// backend/controllers/authController.js
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// --- Helper Function for Password Complexity ---
const validatePasswordComplexity = (password) => {
    // Regex: at least 8 chars AND at least one special symbol (!@#$%^&*)
    const passwordRegex = /^(?=.*[!@#$%^&*])(?=.{8,})/;
    return passwordRegex.test(password);
};

// --- Register User ---
exports.register = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        // 1. Check if user exists by email
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        // 2. Enforce password complexity
        if (!validatePasswordComplexity(password)) {
            return res.status(400).json({
                msg: 'Password must be at least 8 characters long and contain at least one special symbol (!@#$%^&*).'
            });
        }

        // 3. Create user instance
        user = new User({ name, email, password });

        // 4. Hash password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        await user.save();

        // 5. Generate and return JWT
        const payload = { user: { id: user.id } };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
            if (err) throw err;
            res.json({ token });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// --- Login User ---
exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        // 1. Find user
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        // 2. Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        // 3. Generate and return JWT
        const payload = { user: { id: user.id } };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
            if (err) throw err;
            res.json({ token });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// --- Get Profile (Protected) ---
exports.getProfile = async (req, res) => {
    try {
        // Find user by ID injected by authMiddleware, exclude password
        const user = await User.findById(req.user.id).select('-password');

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};