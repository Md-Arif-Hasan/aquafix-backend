const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

exports.authentication = async (req, res, next) => {
 
  try {
    let accessToken = req.cookies.jwt;
    if (!accessToken) {
      return res.status(403).send("Can't access this route!");
    }
    const { username } = jwt.verify(accessToken, process.env.JWT_SECRET);
    req.username = username;
    next();
  } catch (err) {
    return res.status(401).send("Authentication error!");
  }
};

exports.authorization = async (req, res, next) => {
  const usernameFromToken = req.username;
  if (usernameFromToken != req.params.username)
    return res.status(401).send("Unauthorized user detected!");
  next();
};