const express = require('express');
const router = express.Router();
const { 
  getNotes, 
  createNote, 
  updateNote, 
  deleteNote, 
  generateSummary 
} = require('../controllers/noteController');
const { protect } = require('../middleware/authMiddleware');

// Apply protect middleware to all routes
router.use(protect);

// Note routes
router.route('/')
  .get(getNotes)
  .post(createNote);

router.route('/:id')
  .put(updateNote)
  .delete(deleteNote);

// AI Summary route
router.post('/:id/summarize', generateSummary);

module.exports = router;
