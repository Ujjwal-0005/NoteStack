// backend/models/Note.js
const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Links this note to a User document
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    content: {
        type: String,
        required: true
    },
    isPublic: {
        type: Boolean,
        default: false // Controls public sharing
    },
    tags: {
        type: [String],
        default: []
    },
    isPinned: {
        type: Boolean,
        default: false
    },
    isArchived: {
        type: Boolean,
        default: false
    },
    deletedAt: {
        type: Date,
        default: null
    }
}, { timestamps: true });

module.exports = mongoose.model('Note', NoteSchema);