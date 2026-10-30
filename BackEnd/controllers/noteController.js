const Note = require('../models/Note');

const createNote = async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required.' });
    }

    const note = new Note({
      title,
      content,
      userID: req.user.id // ensure this matches your Mongoose Note schema field
    });

    await note.save();
    return res.status(201).json(note); // Returning the created note directly matches React expectations
  } catch (error) {
    return res.status(500).json({ message: 'Error creating note', error: error.message });
  }
};

const getNotes = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Admin can see all notes, regular users only see their own
    const query = req.user.role === 'Admin' ? {} : { userID: req.user.id };

    const notes = await Note.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // If the request doesn't ask for pagination params, send the array directly for simple frontend usage
    if (!req.query.page && !req.query.limit) {
      return res.status(200).json(notes);
    }

    // Otherwise send paginated response
    const total = await Note.countDocuments(query);
    return res.status(200).json({
      success: true,
      page,
      totalPages: Math.ceil(total / limit),
      totalNotes: total,
      data: notes
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const updateNote = async (req, res) => {
  try {
    const query = req.user.role === 'Admin' 
      ? { _id: req.params.id } 
      : { _id: req.params.id, userID: req.user.id };

    const note = await Note.findOneAndUpdate(query, req.body, { new: true });
    
    if (!note) {
      return res.status(404).json({ message: 'Note not found or unauthorized.' });
    }

    return res.status(200).json(note);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const deleteNote = async (req, res) => {
  try {
    const query = req.user.role === 'Admin' 
      ? { _id: req.params.id } 
      : { _id: req.params.id, userID: req.user.id };

    const note = await Note.findOneAndDelete(query);

    if (!note) {
      return res.status(404).json({ success: false, message: 'Note not found or unauthorized.' });
    }

    return res.status(200).json({ success: true, message: 'Note deleted successfully.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { createNote, getNotes, updateNote, deleteNote };