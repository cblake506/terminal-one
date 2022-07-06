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
            
            //Add new note to intermediary table
            await Users_Notes.create({
                user_id: req.session.user_id,
                note_id: noteData.id
            }).catch((err) => {
                // If there's an error, such as the same random pairing of `user.id` and `note.id` occurring and we get a constraint error, don't quit the Node process
                console.log(err);
            });
    } catch (err) {
        console.log(err);
        res.status(400).json(err);
    }
});

// DELETE a note
router.delete('/:id', async (req, res) => {
    try {
        const deleteData = await Users_Notes.destroy({
            where: {
                note_id: req.params.id,
                user_id: req.session.user_id
            }
        });

        if (!deleteData) {
            res.status(404).json({ message: 'No note found with this id!' });
            return;
        }

        //delete from Note if there are no more associations
        noteData = await Users_Notes.findAll({
            where: {
                note_id: req.params.id
            }
        });

        if (noteData.length){
            res.status(200);
            return;
        }

        var deleteNote = await Note.destroy({
            where: {
                id: req.params.id
            }
        });

        if (!deleteNote) {
            res.status(404).json({ message: 'No note found with this id!' });
            return;
        }
        res.status(200).send("deleted");

    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

router.post('/share', async (req, res) => {
    try {
        if (!req.body || ! req.body.user_id || ! req.body.note_id) {
            res.status(400).json({ message: 'Incorrect parameters' });
            return;
        }
        const result = await Users_Notes.create(req.body);
        res.status(200);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

module.exports = router;
