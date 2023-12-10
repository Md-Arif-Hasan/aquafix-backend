const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

exports.createJwtToken = (user) => {
  const jwtToken = jwt.sign({username: user.message.username}, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
  return jwtToken;
};