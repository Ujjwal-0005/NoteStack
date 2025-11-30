// backend/index.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Import routes
// const authRoutes = require('./routes/auth');
// const noteRoutes = require('./routes/notes');

// Middleware
app.use(cors());
app.use(express.json());

// // Connect to MongoDB
// mongoose.connect(process.env.MONGO_URI)
//     .then(() => console.log('MongoDB Connected...'))
//     .catch(err => console.error('MongoDB connection error:', err));

// // Routes
// // /api/users handles all authentication and user profile
// app.use('/api/users', authRoutes);
// // /api/notes handles all note CRUD and public feed
// app.use('/api/notes', noteRoutes);

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server started on port ${PORT}`));



// class work

// app.get("/", (req, res) => {
//     res.status(200).send("Hello from express");
// })
// app.get("/about", (req, res) => {
//     res.status(200).json({ message: 'About page' });

// })
// app.use((req, res) => {
//     res.status(400).send("Page not found");
// })
// app.listen(5000, () => {
//     console.log("Server started on post 5000");
// })

//body parser - middle ware to parse request body 
//install postman also 

app.use(express.urlencoded({ extended: true }));
app.post("/student", (req, res) => {
    console.log(req.body);
    res.send("student data received");
})
app.listen(5000, () => {
    console.log("Serve started on port 5000")
})





