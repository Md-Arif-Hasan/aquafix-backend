const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
dotenv.config();

async function hashingPassword(password) {
  const saltRounds = parseInt(process.env.SALT);
  const salt = await bcrypt.genSalt(saltRounds);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
}

async function checkPassword(password, hashedPassword) {
  const isValidPassword = await bcrypt.compare(password, hashedPassword);
  return isValidPassword;
}

module.exports = { hashingPassword, checkPassword };