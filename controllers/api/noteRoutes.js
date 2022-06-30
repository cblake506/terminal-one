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

// GET a single note
router.get('/:id', async (req, res) => {
    try {
        const noteData = await Note.findByPk(req.params.id, {
            // JOIN with users, using the Users_Notes through table
            include: [{ model: User, through: Users_Notes, as: 'user-to-note' }]
        });
        if (!noteData) {
            res.status(404).json({ message: 'No note found with this id!' });
            return;
        }

        res.status(200).json(noteData);
    } catch (err) {
        res.status(500).json(err);
    }
});


// CREATE a note
router.post('/', async (req, res) => {
    try {
        const noteData = await Note.create(req.body);
        res.status(200).json(noteData);
    } catch (err) {
        console.log(err);
        res.status(400).json(err);
    }
});

// DELETE a note
router.delete('/:id', async (req, res) => {
    try {
        const noteData = await Note.destroy({
            where: {
                id: req.params.id
            }
        });

        if (!noteData) {
            res.status(404).json({ message: 'No note found with this id!' });
            return;
        }

        res.status(200).json(noteData);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;
