const authRouter = require("./authRouter");
const userRouter = require("./userRouter");
const router = require("express").Router();

router.use("/users" , userRouter);
router.use("/auth", authRouter);

module.exports = router;