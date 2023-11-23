const { testConnection } = require("./handler");

const routes = [
  {
    method: "GET",
    path: "/",
    handler: testConnection,
  },
];

module.exports = { routes };
