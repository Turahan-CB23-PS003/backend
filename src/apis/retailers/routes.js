const { routing } = require("../../helpers/Routing");
const {
  postRetailer,
  patchRetailer,
  getSingleRetailer,
  getAllRetailers,
  getAllRetailersImage,
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
    method: "GET",
    path: `${routing}/retailers/images`,
    handler: getAllRetailersImage,
  },
  {
    method: "DELETE",
    path: `${routing}/retailers/{retailerId}`,
    handler: deleteRetailer,
    options: {
      auth: "auth_jwt",
    },
  },
];

module.exports = { routes };
