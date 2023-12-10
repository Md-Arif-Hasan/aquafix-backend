const userRepo = require("../repositories/userRepository");
const {hashingPassword, checkPassword} = require("../utils/hashingPassword");
const userDTO = require("../DTO/userDTO");
const { v4: uuidv4 } = require("uuid");

("use strict");

exports.getAllUsers = async (offset, limit) => {
  const fetchedUsers = await userRepo.getAllUsers(offset, limit);
  if (!fetchedUsers.length) {
    throw Object.assign(new Error("No user in users table!"), {
      statusCode: 404,
    });
  }
  return {status: 200, message: fetchedUsers };
};

exports.getUserDtoByUsername = async (username) => {
  const fetchedUser = await userRepo.getUserByUsername(username);
  if (!fetchedUser) {
    throw Object.assign(new Error("Username doesn't exist in database!"), {
      statusCode: 404,
    });
  }
  return {status: 200, message: new userDTO(fetchedUser) };
};

exports.getUserByUsername = async (username) => {
  const fetchedUser = await userRepo.getUserByUsername(username);
  if (!fetchedUser) {
    throw Object.assign(new Error("Username doesn't exist in database!"), {
      statusCode: 404,
    });
  }
  return {status: 200, message: fetchedUser };
};



exports.getUserPassword = async(username) => {
  const fetchedUser = await userRepo.getUserByUsername(username);
  if (!fetchedUser)
  throw Object.assign(new Error("Username doesn't exist in database!"), {
    statusCode: 404,
  });
  return  {status: 200, message: fetchedUser };
}



exports.createUser = async (user) => {

  const useruuid = uuidv4();
  const username = user.username.toLowerCase();
  const hashedPassword = await hashingPassword(user.password);

    const createdUser = await userRepo.createUser(
      useruuid,
      username,
      user.email,
      hashedPassword
    );
    return {status: 201, message: createdUser };
};

exports.updateUser = async (username, oldPassword, newPassword) => {

  const checkedUser = await this.getUserByUsername(username.toLowerCase());

  if (checkedUser.message) {
    const isPasswordMatched = await checkPassword(
      oldPassword,
      checkedUser.message.password
    );

    if (!isPasswordMatched) {
      throw Object.assign(new Error("Your password isn't correct!"), {
        statusCode: 401,
      });
    }
  }

  const hashedPassword = await hashingPassword(newPassword);
  const updatedUser = await userRepo.updateUser(username, hashedPassword);

  if (!updatedUser) {
    throw Object.assign(new Error("User not found!"), { statusCode: 404 });
  }
  return {status: 200, message: "User updated successfully" };
};

exports.deleteUser = async (username) => {
  const deletedUser = await userRepo.deleteUser(username.toLowerCase());
  if (deletedUser) {
    return {status: 200, message: "User deleted successfully" };
  }
  throw Object.assign(new Error("User not found!"), { statusCode: 404 });
};