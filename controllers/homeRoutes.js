const router = require('express').Router();
const { Note, User } = require('../models');
const withAuth = require('../utils/auth');

router.get('/', withAuth, async (req, res) => {
  try {
    // const userData = await User.findByPk(req.session.user_id, {
    //   // JOIN with users, using the Users_Notes through table
    //   include: [{ model: Note, through: Users_Notes, as: 'note-to-user' }]
    // });
    res.render('homepage',{
      logged_in: req.session.logged_in,
      userName: req.session.userName,
      notes: [{title:'note1', content:'content1'}, {title:'note2', content:'content2'}, {title:'note3', content:'content3'}]
    });
  } catch (err) {
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
