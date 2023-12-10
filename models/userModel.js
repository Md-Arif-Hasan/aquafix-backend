const sequelize = require("../db.config");
const { DataTypes } = require("sequelize");

const User = sequelize.define("users", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    noUpdate: true,
    allowNull: false,
    primaryKey: true,
    validate: {
      notEmpty: true,
    },
  },

  username: {
    type: DataTypes.STRING,
    noUpdate: true,
    allowNull: false,
    unique: true,
    validate: {
      notNull: {
        msg: "Please enter your username. ",
      },
      isAlphanumeric: {
        msg: "Username must contain alphanumeric values. ",
      },
    },
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notNull: {
        msg: "Please enter a valid email. ",
      },
      isEmail: {
        msg: "Email is not valid!!",
      },
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: {
        msg: "Please enter your password! ",
      },
    },
  },
});


module.exports = User;