const router = require('express').Router();
const { User, Note, Users_Notes } = require('../../models');

// GET all Users
router.get('/', async (req, res) => {
  try {
    const userData = await User.findAll();
    res.status(200).json(userData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET a single user
router.get('/:id', async (req, res) => {
  try {
    const userData = await User.findByPk(req.params.id, {
      // JOIN with users, using the Users_Notes through table
      include: [{ model: Note, through: Users_Notes, as: 'note-to-user' }]
    });
    if (!userData) {
      res.status(404).json({ message: 'No user found with this id!' });
      return;
    }

    res.status(200).json(userData);
  } catch (err) {
    res.status(500).json(err);
  }
});


// CREATE a user
router.post('/', async (req, res) => {
  try {
    const userData = await User.create(req.body);
    res.status(200).json(userData);
  } catch (err) {
    res.status(400).json(err);
  }
});

// DELETE a user
router.delete('/:id', async (req, res) => {
  try {
    const userData = await User.destroy({
      where: {
        id: req.params.id
      }
    });

    if (!userData) {
      res.status(404).json({ message: 'No user found with this id!' });
      return;
    }

    res.status(200).json(userData);
  } catch (err) {
    res.status(500).json(err);
  }
});


router.post('/login', async (req, res) => {
  try {
    console.log('login request');
    console.log(req.body);
    const userData = await User.findOne({ where: { userName: req.body.userName } });
    console.log(userData.get({ plain: true }));

    if (!userData) {
      console.log('no userdata')
      res
        .status(400)
        .json('Incorrect email or password, please try again');
      return;
    }
    const validPassword = await userData.checkPassword(req.body.password);
    console.log(validPassword);
    if (!validPassword) {
      console.log('no valid password')
      res
        .status(401)
        .json({ message: 'Incorrect email or password, please try again' });
      return;
    }

    console.log('password ok');
    try {
      req.session.save(() => {
        console.log('ok');
        req.session.user_id = userData.id;
        req.session.logged_in = true;

        res.json({ user: userData, message: 'You are now logged in!' });
      });
    }
    catch (err) {
      console.log('err:', err);
    }


  } catch (err) {
    res.status(400).json(err);
  }
});


module.exports = router;
