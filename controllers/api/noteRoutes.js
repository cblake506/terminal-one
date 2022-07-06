const router = require('express').Router();
const { Note, User, Users_Notes } = require('../../models');
const mailman = require('../../utils/mailman')

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
        
        const isDuplicate = await Users_Notes.findAndCountAll({
            where: {
                user_id: req.body.user_id,
                note_id: req.body.note_id
            }
        })
        if(isDuplicate.count === 0){
            const result = await Users_Notes.create(req.body);
            res.status(200);
        }
        
        let result = await Users_Notes.create(req.body);
        //notify user
        result = await User.findByPk(req.body.user_id, {
             attributes: ['email']
        });
        const user = result.get({plan: true});
        const address = user.email;

        result = await Note.findByPk(req.body.note_id, {
            attributes: ['note_title', 'note_content']
        });
        const note = result.get({plan: true});
        const message = `${req.session.userName} has shared a new <a href="http://notedepot.herokuapp.com">note</a> with you`
                        +`<br/><br/><div style="border: 2px solid pink;"><h3>${note.note_title}</h3><p>${note.note_content}</p></div>`;
        mailman.send(address, message);
        console.log('send response');
        res.status(200).send('note shared');
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

module.exports = router;
