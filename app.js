const express = require("express");
const app = express();
const index = require("./routes/index");
const dotenv = require("dotenv");
dotenv.config();
app.use(express.json());
const cookieParser = require('cookie-parser');

// Enable CORS for all routes
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:5173'); // Replace with the actual origin of your frontend
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true'); // Add this line
  next();
});

app.use(cookieParser());
app.use((err, req, res, next) => {
  if (!err) {
    return next();
  }
  res.status(500);
  res.send('500: Internal server error');
});

app.use("/api/v1/", index);

const PORT = process.env.PORT || 4008;
app.listen(PORT, () => {
  console.log(`Blog station user service is listening on port ${PORT}`);
});

module.exports = app;
