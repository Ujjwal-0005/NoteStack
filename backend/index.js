// backend/index.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const morgan = require('morgan');

const app = express();

// Import routes
const authRoutes = require('./routes/auth');
const noteRoutes = require('./routes/notes');

// Security & Logging Middleware
app.use(helmet());
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());
// Express 5 compatible express-mongo-sanitize middleware (avoids reassigning read-only req.query getter)
app.use((req, res, next) => {
    if (req.body) mongoSanitize.sanitize(req.body);
    if (req.params) mongoSanitize.sanitize(req.params);
    next();
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.error('MongoDB connection error:', err));

// Routes
// /api/users handles all authentication and user profile
app.use('/api/users', authRoutes);
// /api/notes handles all note CRUD and public feed
app.use('/api/notes', noteRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
