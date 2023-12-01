const path = require("path");
const { routing } = require("../../helpers/Routing");
const {
  postRetailer,
  patchRetailer,
  getSingleRetailer,
  getAllRetailers,
  deleteRetailer,
} = require("./handler");

const routes = [
  {
    method: "POST",
    path: `${routing}/retailers`,
    handler: postRetailer,
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
    path: `${routing}/retailers/{retailerId}`,
    handler: patchRetailer,
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
    method: "GET",
    path: `${routing}/retailers/{retailerId}`,
    handler: getSingleRetailer,
  },
  {
    method: "GET",
    path: `${routing}/retailers`,
    handler: getAllRetailers,
  },
  {
    method: "DELETE",
    path: `${routing}/retailers/{retailerId}`,
    handler: deleteRetailer,
    options: {
      auth: "auth_jwt",
    },
  },
  {
    method: "GET",
    path: "/img/retailers/{filename}",
    handler: (request, h) => {
      const { filename } = request.params;
      const filePath = path.join(__dirname, "../../assets/img/retailers", filename);
      return h.file(filePath);
    },
  },
];

module.exports = { routes };
