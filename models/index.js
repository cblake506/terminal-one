const User = require('./User');
const Note = require('./Note');
const Users_Notes = require('./Users-Notes');

User.belongsToMany(Note, {
  // Define the third table needed to store the foreign keys
  through: {
    model: Users_Notes,
    unique: false,
  },
  as: "note-to-user",
  
});

Note.belongsToMany(User, {
  // Define the third table needed to store the foreign keys
  through: {
    model: Users_Notes,
    unique: false,
  },
  as: "user-to-note",
  
});


module.exports = { User, Note, Users_Notes };
