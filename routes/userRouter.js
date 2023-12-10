const express = require("express");
const router = express.Router();
const {authentication, authorization} = require("../middlewares/authMiddleware");
const userController = require("../controllers/userController");

router.get("/", userController.getAllUsers);

router.get("/:username",  userController.getUserByUsername);
router.put("/:username", authentication, authorization, userController.updateUser);
router.delete("/:username",authentication, authorization, userController.deleteUser);

module.exports = router;