const Joi = require("joi");
const pool = require("../../helpers/DatabasePool");
const { InvariantError } = require("../../helpers/ErrorsManager");

const verifyNewEmail = async (email) => {
  const existingUser = await _executeQuery({
    sql: "SELECT * FROM users WHERE email = ?",
    values: [email],
  });

  if (existingUser.length > 0) {
    throw new InvariantError("Email address is already in use");
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    throw new InvariantError("Invalid email address format");
  }
};

const postRegisterSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  name: Joi.string().required(),
  image: Joi.any(),
});

const postLoginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const patchUserSchema = Joi.object({
  name: Joi.string().required(),
  image: Joi.any(),
});

const _executeQuery = (query) => {
  return new Promise((resolve, reject) => {
    pool.query(query, (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
};

module.exports = {
  verifyNewEmail,
  postRegisterSchema,
  postLoginSchema,
  patchUserSchema,
};
