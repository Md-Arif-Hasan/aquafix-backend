const dotenv = require("dotenv");
const Sequelize = require("sequelize");
dotenv.config();

const sequelize = new Sequelize("aquafix", "root", "", {
  host: process.env.HOST,
  dialect: "mysql",
});

(async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
})();

module.exports = sequelize;
