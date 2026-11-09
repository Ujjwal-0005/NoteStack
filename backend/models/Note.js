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

// Compound text index for full-text search on title and content
NoteSchema.index({ title: 'text', content: 'text' });
// Compound indexes for user queries filtering by view, status, and sorted by isPinned and updatedAt
NoteSchema.index({ user: 1, deletedAt: 1, isArchived: 1, isPinned: -1, updatedAt: -1 });
NoteSchema.index({ user: 1, tags: 1 });
// Index for public feed
NoteSchema.index({ isPublic: 1, deletedAt: 1, updatedAt: -1 });

module.exports = mongoose.model('Note', NoteSchema);