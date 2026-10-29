const Note = require('../models/Note');

const createNote = async (req, res) => {
  try {
    const { title, content } = req.body;
    const note = new Note({ title, content, userId: req.user.id });
    await note.save();
    res.status(201).json({ message: 'Note created successfully', note });
    } catch (error) {
    res.status(500).json({ message: 'Error creating note', error: error.message });
    }
};