const password = require("../utils/hashingPassword");
const userInfo = require("../utils/userInfoValidation");
const userService = require("../services/userService");

("use strict");

exports.register = async (user) => {
    const createdUser = await userService.createUser(user);
    return createdUser;
};


exports.login = async (user) => {
    const checkedUser = await userService.getUserByUsername(user.username.toLowerCase());

    if (checkedUser.message) {
      const isPasswordMatched = await password.checkPassword(
        user.password,
        checkedUser.message.password
      );
      if (!isPasswordMatched) {
        throw Object.assign(new Error("Your password isn't correct!"), {
          statusCode: 401,
        });
      }
      return checkedUser;
    }
};