// backend/routes/notes.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const validate = require('../middleware/validate');
const { noteSchema, updateNoteSchema } = require('../validation/schemas');
const {
    getNotes,
    createNote,
    updateNote,
    deleteNote,
    getPublicFeed,
    getPublicNote
} = require('../controllers/noteController');

// --- UNPROTECTED PUBLIC ROUTES (MUST BE FIRST) ---
// @route   GET /api/notes/public/feed (Specific)
router.get('/public/feed', getPublicFeed);

// @route   GET /api/notes/public/:id (Dynamic)
router.get('/public/:id', getPublicNote);

// --- PROTECTED PRIVATE ROUTES (Requires auth middleware) ---
// @route   GET /api/notes
router.get('/', auth, getNotes);

// @route   POST /api/notes
router.post('/', auth, validate(noteSchema), createNote);

// @route   PUT /api/notes/:id
router.put('/:id', auth, validate(updateNoteSchema), updateNote);

// @route   DELETE /api/notes/:id
router.delete('/:id', auth, deleteNote);

module.exports = router;