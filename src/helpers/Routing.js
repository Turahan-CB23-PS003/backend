/* global process */

require("dotenv").config();

const getBaseUrl = (request) => {
  const protocol = request.headers["x-forwarded-proto"] || "http";
  const baseUrl = `${protocol}://${request.headers.host}`;

  return baseUrl;
};

const routing = `/api/${process.env.VER}`;

module.exports = { routing, getBaseUrl };
