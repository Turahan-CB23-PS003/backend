const { routing } = require("../../helpers/Routing");
const { postRegister, postLogin, getUser, patchUser } = require("./handler");

const routes = [
  {
    method: "POST",
    path: `${routing}/register`,
    handler: postRegister,
    options: {
      payload: {
        output: "stream",
        parse: true,
        multipart: true,
        maxBytes: 2 * 1024 * 1024,
      },
    },
  },
  {
    method: "POST",
    path: `${routing}/login`,
    handler: postLogin,
  },
  {
    method: "GET",
    path: `${routing}/users/{userId}`,
    handler: getUser,
    options: {
      auth: "auth_jwt",
    },
  },
  {
    method: "PATCH",
    path: `${routing}/users/{userId}`,
    handler: patchUser,
    options: {
      auth: "auth_jwt",
      payload: {
        output: "stream",
        parse: true,
        multipart: true,
        maxBytes: 2 * 1024 * 1024,
      },
    },
  },
];

module.exports = { routes };
