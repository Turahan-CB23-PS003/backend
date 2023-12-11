const path = require("path");

const routes = [
  {
    method: "GET",
    path: "/",
    handler: (request, h) => {
      const filename = "index.html";
      const filePath = path.join(__dirname, "../../dist", filename);
      return h.file(filePath);
    },
  },
  {
    method: "GET",
    path: "/{filename}",
    handler: (request, h) => {
      const { filename } = request.params;
      if (filename === "index.html") {
        return h.redirect("/");
      }
      const filePath = path.join(__dirname, "../../dist", filename);
      return h.file(filePath);
    },
  },
  {
    method: "GET",
    path: "/assets/{filename}",
    handler: (request, h) => {
      const { filename } = request.params;
      const filePath = path.join(__dirname, "../../dist/assets", filename);
      return h.file(filePath);
    },
  },
];

module.exports = { routes };
