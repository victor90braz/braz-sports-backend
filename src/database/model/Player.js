const { Schema, model } = require("mongoose");

const PlayerSchema = new Schema({
  image: {
    type: String,
  },
  name: {
    type: String,
    require: true,
  },
  surname: {
    type: String,
    require: true,
  },
  username: {
    type: String,
    require: true,
    unique: true,
  },
  password: {
    type: String,
    require: true,
  },
  age: {
    type: String,
  },
  email: {
    type: String,
    require: true,
    unique: true,
  },
  contactNumber: {
    type: String,
  },
  country: {
    type: String,
  },
  province: {
    type: String,
  },
  linkLocation: {
    type: String,
  },
  sport: {
    type: String,
  },
  detailClub: {
    type: String,
  },
  rate: {
    type: String,
  },
  averageRate: {
    type: String,
  },
  flag: {
    type: String,
  },
  nazionality: {
    type: String,
  },
  dateEvent: {
    type: String,
  },
  timeEvent: {
    type: String,
  },
  gender: {
    type: String,
  },
  level: {
    type: String,
  },
  locationEvent: {
    type: String,
  },
  payment: {
    type: String,
  },
  descriptionEvent: {
    type: String,
  },
  strenght: {
    type: String,
  },
  flaw: {
    type: String,
  },
  blocker: {
    type: String,
  },
  latitude: {
    type: String,
  },
  longitude: {
    type: String,
  },
});

const PlayerModel = model("Player", PlayerSchema, "players");
module.exports = PlayerModel;
