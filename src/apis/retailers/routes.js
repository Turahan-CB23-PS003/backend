const { routing } = require("../../helpers/Routing");
const { testConnection } = require("./handler");

const routes = [
  {
    method: "GET",
    path: `${routing}/`,
    handler: testConnection,
  },
];

module.exports = { routes };
