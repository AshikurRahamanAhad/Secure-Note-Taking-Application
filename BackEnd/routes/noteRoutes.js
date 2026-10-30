const express = require('express');
const { createNote, getNotes, updateNote, deleteNote } = require('../controllers/noteController');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

router.route('/')
    .post(verifyToken, createNote)
    .get(verifyToken, getNotes);

router.route('/:id')
    .put(verifyToken, updateNote)
    .delete(verifyToken, deleteNote);

module.exports = router;