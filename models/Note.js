const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

// create our Note model
class Note extends Model {}

// create fields/columns for Location model
Note.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    note_content: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'note'
  }
);

module.exports = Note;
