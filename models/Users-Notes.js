const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

// create our users_notes model
class Users_Notes extends Model {}

// create fields/columns for users_notes model
Users_Notes.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'user',
        key: 'id',
        unique: false
      }
    },
    note_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'note',
        key: 'id',
        unique: false
      }
    }
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'users_notes'
  }
);

module.exports = Users_Notes;
