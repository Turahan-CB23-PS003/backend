const path = require("path");
const fileNameHandler = (filename) => {
  if (
    !filename.includes(".") &&
    !filename.includes("assets") &&
    !filename.includes("api") &&
    !filename.includes("favicon") &&
    filename !== "index.html"
  ) {
    return "index.html";
  }
  return filename;
};

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
    path: "/assets/{filename}",
    handler: (request, h) => {
      const { filename } = request.params;
      const filePath = path.join(__dirname, "../../dist/assets", filename);
      return h.file(filePath);
    },
  },
  {
    method: "GET",
    path: "/{filename}",
    handler: (request, h) => {
      const { filename } = request.params;
      const newFilename = fileNameHandler(filename);
      const filePath = path.join(__dirname, "../../dist", newFilename);
      return h.file(filePath);
    },
  },
];

module.exports = { routes };
