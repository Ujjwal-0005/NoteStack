// backend/controllers/noteController.js
const Note = require('../models/Note');

// --- Private Notes (CRUD) ---

exports.getNotes = async (req, res) => {
    try {
        const notes = await Note.find({
            user: req.user.id,
            deletedAt: null,
            isArchived: false
        }).sort({ isPinned: -1, updatedAt: -1 });
        res.json(notes);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

exports.createNote = async (req, res) => {
    const { title, content, isPublic, tags, isPinned, isArchived } = req.body;
    try {
        const newNote = new Note({
            user: req.user.id,
            title,
            content,
            isPublic: isPublic || false,
            tags: tags || [],
            isPinned: isPinned || false,
            isArchived: isArchived || false
        });
        const note = await newNote.save();
        res.json(note);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

exports.updateNote = async (req, res) => {
    const { title, content, isPublic, tags, isPinned, isArchived } = req.body;
    const noteFields = {};
    if (title !== undefined) noteFields.title = title;
    if (content !== undefined) noteFields.content = content;
    if (isPublic !== undefined) noteFields.isPublic = isPublic;
    if (tags !== undefined) noteFields.tags = tags;
    if (isPinned !== undefined) noteFields.isPinned = isPinned;
    if (isArchived !== undefined) noteFields.isArchived = isArchived;

    try {
        let note = await Note.findById(req.params.id);
        if (!note) return res.status(404).json({ msg: 'Note not found' });

        // Check ownership
        if (note.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        note = await Note.findByIdAndUpdate(
            req.params.id,
            { $set: noteFields },
            { new: true }
        );
        res.json(note);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

// Soft delete: moves note to trash
exports.deleteNote = async (req, res) => {
    try {
        let note = await Note.findById(req.params.id);
        if (!note) return res.status(404).json({ msg: 'Note not found' });

        // Check ownership
        if (note.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        note.deletedAt = new Date();
        note.isPinned = false; // Unpin when moved to trash
        await note.save();
        res.json({ msg: 'Note moved to trash', note });
    } catch (err) {
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Note not found' });
        }
        res.status(500).send('Server Error');
    }
};

// Restore from trash
exports.restoreNote = async (req, res) => {
    try {
        let note = await Note.findById(req.params.id);
        if (!note) return res.status(404).json({ msg: 'Note not found' });

        // Check ownership
        if (note.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        note.deletedAt = null;
        await note.save();
        res.json({ msg: 'Note restored', note });
    } catch (err) {
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Note not found' });
        }
        res.status(500).send('Server Error');
    }
};

// Permanently delete note
exports.deletePermanent = async (req, res) => {
    try {
        let note = await Note.findById(req.params.id);
        if (!note) return res.status(404).json({ msg: 'Note not found' });

        // Check ownership
        if (note.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        await Note.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Note deleted permanently' });
    } catch (err) {
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Note not found' });
        }
        res.status(500).send('Server Error');
    }
};

// --- Public Feed & Single Note ---

exports.getPublicFeed = async (req, res) => {
    try {
        // Populate author name for display (privacy: do not expose email)
        const publicNotes = await Note.find({ isPublic: true })
            .populate('user', 'name')
            .sort({ updatedAt: -1 });
        res.json(publicNotes);
    } catch (err) {
        console.error("Error fetching public feed:", err.message);
        res.status(500).send('Server Error');
    }
};

exports.getPublicNote = async (req, res) => {
    try {
        const note = await Note.findById(req.params.id)
            .populate('user', 'name'); // Populate author name only (privacy: do not expose email)

        if (!note || !note.isPublic) {
            return res.status(404).json({ msg: 'Public note not found or is private' });
        }

        res.json(note);
    } catch (err) {
        // Catches Cast to ObjectId failed for value "feed" or other invalid IDs
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Public note not found' });
        }
        res.status(500).send('Server Error');
    }
};