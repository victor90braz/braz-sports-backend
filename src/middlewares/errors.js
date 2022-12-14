require("dotenv").config();
const debug = require("debug")("braz-sports*:server:middlewares:errors");
const chalk = require("chalk");
const { ValidationError } = require("express-validation");
const customError = require("../utils/customError");

const notFoundError = (req, res, next) => {
  const error = customError(404, "Endpoint not found");

  next(error);
};

// eslint-disable-next-line no-unused-vars
const generalError = (error, req, res, next) => {
  debug(chalk.red(error.message || error.customMessage));
  const message = error.customMessage ?? "General pete";
  const statusCode = error.statusCode ?? 500;

  res.status(statusCode).json({ error: true, message });
};

const validationError = (error, req, res, next) => {
  if (error instanceof ValidationError) {
    res.status(400).json({ msg: "Bad request" });
    debug(chalk.bgRedBright(error.message));
  } else {
    next(error);
  }
};

module.exports = {
  notFoundError,
  generalError,
  validationError,
};
