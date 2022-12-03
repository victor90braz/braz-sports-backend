const { Joi } = require("express-validation");

const credentialsLoginSchema = {
  body: Joi.object({
    username: Joi.string()
      .max(30)
      .messages({ message: "A username is Required" })
      .required(),
    password: Joi.string()

      .min(9)
      .max(20)
      .messages({ message: "A Password is Required" })
      .required(),
  }),
};

const userRegisterCredentials = {
  body: Joi.object({
    name: Joi.string()
      .max(30)
      .messages({ message: "A name is Required" })
      .required(),
    username: Joi.string()
      .max(20)
      .messages({ message: "A username is Required" })
      .required(),
    password: Joi.string()
      .min(9)
      .max(20)
      .messages({
        message: "A Password is Required. Min 9 characters long",
      })
      .required(),
  }),
};

module.exports = {
  userRegisterCredentials,
  credentialsLoginSchema,
};
