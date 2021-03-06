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

router.get('/notme', async (req, res) => {
    try {
        if (req.session && req.session.logged_in){
            const userData = await User.findAll();
            let users = userData
                        .map(x => x.get({plain: true}))
                        .filter(x => x.userName != req.session.userName)
                        .map(x => {return {'id':x.id, 'userName':x.userName};});
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(users));
        }
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
        const userData = await User.findOne({ where: { userName: req.body.userName } });
        if (!userData) {
            res
                .status(400)
                .json({ message: 'Incorrect email or password, please try again' });
            return;
        }
        const validPassword = await userData.checkPassword(req.body.password);
        if (!validPassword) {
            res
                .status(401)
                .json({ message: 'Incorrect email or password, please try again' });
            return;
        }
        req.session.save(() => {
            req.session.user_id = userData.id;
            req.session.logged_in = true;
            req.session.userName = req.body.userName;

            res.json({ user: userData, message: 'You are now logged in!' });
        });

    } catch (err) {
        console.log(err);
        res.status(400).json(err);
    }
});

router.post('/logout', (req, res) => {
  if (req.session.logged_in) {
    req.session.destroy(() => {
      res.status(204).end();
    });
  } else {
    res.status(404).end();
  }
});


module.exports = router;
