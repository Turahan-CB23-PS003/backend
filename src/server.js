/* global process */

const Hapi = require("@hapi/hapi");
const Inert = require("@hapi/inert");
require("dotenv").config();

const { routes: retailersRoutes } = require("./apis/retailers/routes");
const { routes: mealsRoutes } = require("./apis/meals/routes");

const init = async () => {
  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ["*"],
      },
    },
  });

  await server.register([Inert]);

  server.route([...retailersRoutes, ...mealsRoutes]);

  await server.start();
  console.log("Server running on %s", server.info.uri);
};

process.on("unhandledRejection", (err) => {
  console.error(err);
  process.exit(1);
});

init();
