const sequelize = require('../config/connection');
const { User, Note, Users_Notes } = require('../models');

const userSeedData = require('./userData.json');
const noteSeedData = require('./noteData.json');

const seedDatabase = async () => {
  await sequelize.sync({ force: true });

  const users = await User.bulkCreate(userSeedData);

  const notes = await Note.bulkCreate(noteSeedData);

  // Create user-notes at random
  for (let i = 0; i < 10; i++) {
    // Get a random users's `id`
    const { id: randomUserId } = users[
      Math.floor(Math.random() * users.length)
    ];

    // Get a random note's `id`
    const { id: randomNoteId } = notes[
      Math.floor(Math.random() * notes.length)
    ];

    // Create a new user-note with random `user_amount` values, but with ids selected above
    await Users_Notes.create({
      user_id: randomUserId,
      note_id: randomNoteId
    }).catch((err) => {
      // If there's an error, such as the same random pairing of `user.id` and `note.id` occurring and we get a constraint error, don't quit the Node process
      console.log(err);
    });
  }

  process.exit(0);
};

seedDatabase();
