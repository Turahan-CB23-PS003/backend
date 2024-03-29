/* global process */

const Jwt = require("@hapi/jwt");
require("dotenv").config();

const generateAccessToken = (payload) => {
  return Jwt.token.generate(payload, process.env.ACCESS_TOKEN_KEY);
};

module.exports = {
  generateAccessToken,
};
