const userService = require("../services/userService");
const { sendResponse } = require("../utils/contentNegotiation");
const { paginate } = require("../utils/pagination");
const userInfo = require("../utils/userInfoValidation");

("use strict");

exports.getAllUsers = async (req, res, next) => {
  try {
    const { offset, limit } = paginate(req);
    const allUsers = await userService.getAllUsers(offset, limit);
    return sendResponse(req, res, allUsers.status, allUsers.message);
  } catch (error) {
    next(error);
  }
};

exports.getUserByUsername = async (req, res, next) => {
  try {
    const oneUser = await userService.getUserDtoByUsername(req.params.username);
    return sendResponse(req, res, oneUser.status, oneUser.message);
  } catch (error) {
    next(error);
  }
};


exports.updateUser = async (req, res, next) => {
  try {
    const username = req.params.username.toLowerCase();
    const { oldPassword, newPassword } = req.body;
  
    const updatedUser = await userService.updateUser(username,  oldPassword, newPassword);
    res.status(updatedUser.status).send(updatedUser.message);
  } catch (error) {
    next(error)
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const username = req.params.username.toLowerCase();
    const deletedUser = await userService.deleteUser(username);
    res.status(deletedUser.status).send(deletedUser.message);
  } catch (error) {
    next(error);
  }
};