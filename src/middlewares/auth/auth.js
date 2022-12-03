require("dotenv").config();
const chalk = require("chalk");
const debug = require("debug");
const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  const { authorization } = req.headers;
  try {
    if (!authorization.includes("Bearer ")) {
      debug(chalk.red("No authorization"));

      throw new Error();
    }
    const token = authorization.replace("Bearer ", "");
    const { id } = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = id;

    next();
  } catch (error) {
    const customError = new Error("Invalid token");
    customError.message = "Invalid token";
    customError.code = 401;

    next(customError);
  }
};

module.exports = auth;
