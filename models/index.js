const User = require('./userModel');
const sequelize = require("../db.config");

const test = async () => {
  await sequelize.sync({ force:false });
  console.log("Index is synchronized successfully.");
};
test();

  module.exports = {
    User
  }