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

const getNotes = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const query = req.user.role === 'Admin' ? {} : { userId: req.user.id }; // Admin can see all notes,but users only see their own 

    const notes = await Note.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit);
    const total = await Note.countDocuments(query);

    res.status(200).json({
      success: true,
      page,
      totalPages: Math.ceil(total / limit),
      totalNotes: total,
      data: notes
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateNote = async (req, res) => {
  try {
    const query = req.user.role === 'Admin' ? { _id: req.params.id } : { _id: req.params.id, userId: req.user.id };
    const note = await Note.findOneAndUpdate(query, req.body, { new: true });
    
    if (!note) return res.status(404).json({ message: 'Not found.' });
    res.status(200).json({ data: note });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createNote, getNotes, updateNote };