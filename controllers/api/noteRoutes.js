const router = require('express').Router();
const { Note, User, Users_Notes } = require('../../models');

// GET all notes
router.get('/', async (req, res) => {
  try {
    const noteData = await Note.findAll();
    res.status(200).json(noteData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
