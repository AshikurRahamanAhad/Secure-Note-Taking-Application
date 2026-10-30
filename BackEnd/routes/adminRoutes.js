const express = require('express');
const { getUsersWithNotes } = require('../controllers/adminController');
const { verifyToken, verifyAdmin } = require('../middleware/auth');

const router = express.Router();

router.get('/users-with-notes', verifyToken, verifyAdmin, getUsersWithNotes);

module.exports = router;