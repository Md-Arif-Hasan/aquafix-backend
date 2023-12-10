const usernameRegex = /^[a-zA-Z0-9_-]{3,70}$/;
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

function isValidUsername(username) {
  if (usernameRegex.test(username)) return true;
  return false;
}

function isValidPassword(password) {
  if (!passwordRegex.test(password)) return false;
  return true;
}

function isValidEmail(email) {
  if (!emailRegex.test(email)) return false;
  return true;
}

function userInfoValidation(user) {

  username = user.username;
  email = user.email;
  password = user.password;
  
  
  if (!username || !password) throw Object.assign(new Error("Enter all the fields!"), { statusCode: 400 });
  if (!isValidUsername(username)) throw Object.assign(new Error( "Enter a valid username"), { statusCode: 400 });
  if (!isValidPassword(password)) throw Object.assign(new Error( "Enter a valid password"), { statusCode: 400 });
  if (!isValidEmail(email)) throw Object.assign(new Error( "Enter a valid email"), { statusCode: 400 });
}

function userUpdateValidation(password) {
  if (!password) throw Object.assign(new Error("Enter the password field!"), { statusCode: 400 });
  if (!isValidPassword(password)) throw Object.assign(new Error( "Enter a valid password"), { statusCode: 400 });
}


module.exports = {
  userInfoValidation,
  userUpdateValidation
};