/* global process */

const Hapi = require("@hapi/hapi");
require("dotenv").config();

const { routes: retailersRoutes } = require("./apis/retailers/routes");

const init = async () => {
  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.DB_HOST,
  });

  server.route([...retailersRoutes]);

  await server.start();
  console.log("Server running on %s", server.info.uri);
};

process.on("unhandledRejection", (err) => {
  console.error(err);
  process.exit(1);
});

init();
