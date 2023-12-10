const path = require("path");
const { routing } = require("../../helpers/Routing");
const {
  postRegister,
  postLogin,
  getUser,
  patchUser,
  patchPassword,
} = require("./handler");

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
  {
    method: "PATCH",
    path: `${routing}/users/{userId}/password`,
    handler: patchPassword,
    options: {
      auth: "auth_jwt",
    },
  },
  {
    method: "GET",
    path: "/img/users/{filename}",
    handler: (request, h) => {
      const { filename } = request.params;
      const filePath = path.join(__dirname, "../../assets/img/users", filename);
      return h.file(filePath);
    },
  },
];

module.exports = { routes };
