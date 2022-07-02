const router = require('express').Router();
const { Note, User, Users_Notes } = require('../models');
const withAuth = require('../utils/auth');

router.get('/', withAuth, async (req, res) => {
  try {
    const userData = await User.findByPk(req.session.user_id, {
       include: [{ model: Note, through: Users_Notes, as: 'note-to-user' }]
    });
    const notesData = userData.get({plain: true})['note-to-user'];
    const notes = notesData.map(x => {return {id: x.id, title: x.note_title, content: x.note_content}});
    console.log(notes);
    res.render('homepage',{
      logged_in: req.session.logged_in,
      userName: req.session.userName,
      notes: notes
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.get('/login', async (req, res) => {
  try {
    res.render('login');
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
