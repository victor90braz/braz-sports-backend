const express = require("express");
const { validate } = require("express-validation");
const auth = require("../../middlewares/auth/auth");
const {
  userRegisterCredentials,
  credentialsLoginSchema,
} = require("../../schemas/userCredentials");
const {
  registerUser,
  loginUser,
  getUser,
} = require("../controllers/userControllers");

const userRouter = express.Router();

userRouter.post("/register", validate(userRegisterCredentials), registerUser);
userRouter.post("/login", validate(credentialsLoginSchema), loginUser);
userRouter.get("/:username", auth, getUser);

module.exports = userRouter;
