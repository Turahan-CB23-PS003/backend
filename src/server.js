const Hapi = require("@hapi/hapi");
const Inert = require("@hapi/inert");
const Jwt = require("@hapi/jwt");
require("dotenv").config();

// const { routes: retailersRoutes } = require("./apis/retailers/routes");
const { routes: mealsRoutes } = require("./apis/meals/routes");
const { routes: usersRoutes } = require("./apis/users/routes");
const { routes: mainsRoutes } = require("./apis/mains/routes");

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

  await server.register([
    Inert,
    {
      plugin: Jwt,
    },
  ]);

  server.auth.strategy("auth_jwt", "jwt", {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
  });

  server.route([
    // ...retailersRoutes,
    ...mealsRoutes,
    ...usersRoutes,
    ...mainsRoutes,
  ]);

  await server.start();
  console.log("Server running on %s", server.info.uri);
};

process.on("unhandledRejection", (err) => {
  console.error(err);
  process.exit(1);
});

init();
