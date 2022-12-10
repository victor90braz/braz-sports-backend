const chalk = require("chalk");
const debug = require("debug");
const PlayerModel = require("../../database/model/Player");

const customError = require("../../utils/customError");

const getPlayer = async (req, res) => {
  debug(chalk.green("Player request received"));
  const players = await PlayerModel.find();
  res.status(200).json(players);
};

const getPlayerID = async (req, res, next) => {
  const { idPlayer } = req.params;
  try {
    const player = await PlayerModel.findById(idPlayer);

    debug(chalk.green("Someone asked for a specific player"));

    res.status(200).json({ player });
  } catch (err) {
    err.message = "Player not found";
    err.code = 404;

    next(err);
  }
};

const deletePlayer = async (req, res, next) => {
  const { idPlayer } = req.params;

  try {
    await PlayerModel.findByIdAndDelete(idPlayer);

    res.status(200).json({ msg: "Player deleted" });
    debug(chalk.green("Someone deleted a player"));
  } catch (err) {
    debug(chalk.red("Someone tried to delete a player that we don't have"));
    err.message = "No player with that id found";
    err.code = 404;

    next(err);
  }
};

const createPlayer = async (req, res, next) => {
  const {
    image,
    name,
    surname,
    username,
    password,
    age,
    email,
    contactNumber,
    country,
    province,
    linkLocation,
    sport,
    detailClub,
    winner,
    loser,
    rate,
    averageRate,
    flag,
    nazionality,
    dateEvent,
    timeEvent,
    gender,
    level,
    locationEvent,
    payment,
    descriptionEvent,
    strength,
    flaw,
    blocker,
    defense,
    expetaction,
    latitude,
    longitude,
  } = req.body;

  const searchByName = { username };
  const player = await PlayerModel.findOne(searchByName);

  try {
    if (player) {
      const error = new Error();
      const customNewError = customError(409, "Player already exists");
      error.statusCode = 409;
      next(customNewError);
      return;
    }

    const playerCreate = {
      image,
      name,
      surname,
      username,
      password,
      age,
      email,
      contactNumber,
      country,
      province,
      linkLocation,
      sport,
      detailClub,
      winner,
      loser,
      rate,
      averageRate,
      flag,
      nazionality,
      dateEvent,
      timeEvent,
      gender,
      level,
      locationEvent,
      payment,
      descriptionEvent,
      strength,
      flaw,
      blocker,
      defense,
      expetaction,
      latitude,
      longitude,
    };

    await PlayerModel.create(playerCreate);

    debug(chalk.green("Player created"));
    res.status(201).json({ msg: "Player created" });
  } catch (error) {
    error.statusCode = 400;
    debug(chalk.red("Bad request"));
    error.customMessage = "Bad request";

    next(error);
  }
};

const editPlayer = async (req, res, next) => {
  const { idPlayer } = req.params;
  const {
    image,
    name,
    surname,
    username,
    password,
    age,
    email,
    contactNumber,
    country,
    province,
    linkLocation,
    sport,
    detailClub,
    winner,
    loser,
    rate,
    averageRate,
    flag,
    nazionality,
    dateEvent,
    timeEvent,
    gender,
    level,
    locationEvent,
    payment,
    descriptionEvent,
    strength,
    flaw,
    blocker,
    defense,
    expetaction,
    latitude,
    longitude,
  } = req.body;
  try {
    const playerEdited = {
      image,
      name,
      surname,
      username,
      password,
      age,
      email,
      contactNumber,
      country,
      province,
      linkLocation,
      sport,
      detailClub,
      winner,
      loser,
      rate,
      averageRate,
      flag,
      nazionality,
      dateEvent,
      timeEvent,
      gender,
      level,
      locationEvent,
      payment,
      descriptionEvent,
      strength,
      flaw,
      blocker,
      defense,
      expetaction,
      latitude,
      longitude,
    };

    await PlayerModel.findByIdAndUpdate(idPlayer, playerEdited);
    const newPlayer = await PlayerModel.findById(idPlayer);

    debug(newPlayer);

    res.status(200).json(newPlayer);
  } catch (error) {
    debug(chalk.red("Bad request, player not exist to be edit."));

    error.statusCode = 400;
    error.customMessage = "Error editing player, check if it's exist";

    next(error);
  }
};

module.exports = {
  getPlayer,
  deletePlayer,
  createPlayer,
  editPlayer,
  getPlayerID,
};
