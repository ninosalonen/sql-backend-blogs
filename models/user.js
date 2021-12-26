const { Model, DataTypes } = require('sequelize')
const { sequelize } = require('../utils/db')

class User extends Model {}

User.init(
  {
    name: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    username: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true,
      validate: {
        is: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g,
      },
    },
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    password: {
      type: DataTypes.TEXT,
      unique: true,
    },
  },
  {
    sequelize,
    underscored: true,
    modelName: 'user',
  }
)

module.exports = {
  User,
}
