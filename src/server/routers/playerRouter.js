const express = require("express");

const {
  getPlayer,
  deletePlayer,
  createPlayer,
  editPlayer,
  getPlayerID,
} = require("../controllers/playerControllers");

const playerRouter = express.Router();

playerRouter.get("/", getPlayer);
playerRouter.get("/:idPlayer", getPlayerID);
playerRouter.delete("/:idPlayer", deletePlayer);
playerRouter.post("/", createPlayer);
playerRouter.put("/:idPlayer", editPlayer);

module.exports = playerRouter;
