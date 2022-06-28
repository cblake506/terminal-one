const router = require('express').Router();
const { Note, User } = require('../models');
//const withAuth = require('../utils/auth');

router.get('/', async (req, res) => {
  try {
    console.log(req.session.logged_in);
    res.render('homepage',{
      logged_in: req.session.logged_in,
      userName: req.session.userName
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
