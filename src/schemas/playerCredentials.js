const { Joi } = require("express-validation");

const playerCredentials = {
  body: Joi.object({
    name: Joi.string()
      .max(30)
      .messages({ message: "A name is required" })
      .required(),
    nationality: Joi.string()
      .messages({ message: "Content for the nationality is required" })
      .required(),
    perfil: Joi.string()
      .messages({ message: "Content for the perfil is required" })
      .required(),
    video: Joi.string()
      .messages({ message: "Content for the video is required" })
      .required(),
    image: Joi.string()
      .messages({ message: "Content for the image is required" })
      .required(),
    speed: Joi.number().integer().min(1).max(99).required(),
    shoot: Joi.number().integer().min(1).max(99).required(),
    pass: Joi.number().integer().min(1).max(99).required(),
    agility: Joi.number().integer().min(1).max(99).required(),
    defense: Joi.number().integer().min(1).max(99).required(),
    strength: Joi.number().integer().min(1).max(99).required(),
  }),
};

module.exports = {
  playerCredentials,
};
