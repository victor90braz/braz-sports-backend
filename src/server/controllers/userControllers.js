require("dotenv").config();
const bcrypt = require("bcrypt");
const debug = require("debug");
const chalk = require("chalk");
const jsonwebtoken = require("jsonwebtoken");
const User = require("../../database/model/User");
const customError = require("../../utils/customError");
const Player = require("../../database/model/Player");

const registerUser = async (req, res, next) => {
  const { name, username, password } = req.body;

  const queryFind = { username };
  const user = await User.findOne(queryFind);

  try {
    if (user) {
      const error = new Error();
      const customNewError = customError(409, "User already exists");
      error.statusCode = 409;
      next(customNewError);
      return;
    }

    const encryptPassword = await bcrypt.hash(password, 10);

    const queryCreate = {
      username,
      password: encryptPassword,
      name,
    };

    await User.create(queryCreate);

    debug(chalk.green("User created"));
    res.status(201).json({ msg: "User created" });
  } catch (error) {
    error.statusCode = 400;
    debug(chalk.red("Bad request"));
    error.customMessage = "Bad request";

    next(error);
  }
};

const loginUser = async (req, res, next) => {
  const { username, password } = req.body;

  try {
    const queryFindOne = {
      username,
    };

    const user = await User.findOne(queryFindOne);

    if (user) {
      const checkPassword = await bcrypt.compare(password, user.password);

      if (checkPassword) {
        const userData = {
          username: user.username,
          id: user.id,
        };

        const token = jsonwebtoken.sign(userData, process.env.JWT_SECRET);
        res.status(200).json({ token });
      } else {
        const error = new Error();
        error.statusCode = 401;
        error.customMessage = "Incorrect username or password";
        next(error);
        return;
      }
    } else {
      const error = new Error();
      error.statusCode = 401;
      error.customMessage = "Incorrect username or password";
      next(error);
    }
  } catch (error) {
    next(error);
  }
};

const getUser = async (req, res, next) => {
  const { surname } = req.params;

  try {
    const user = await User.findOne({ surname }).populate(
      "players",
      null,
      Player
    );

    const userWithoutPassword = {
      username: user.username,
      name: user.name,
      image: user.image,
      notes: user.notes,
      id: user.id,
    };

    res.status(200).json({ user: userWithoutPassword });
    debug(chalk.green("Someone asked for a user"));
  } catch (err) {
    debug(chalk.red("Someone tried to get a user that we don't have"));

    err.message = "No user with that username found";
    err.code = 404;
    next(err);
  }
};

module.exports = { registerUser, loginUser, getUser };
