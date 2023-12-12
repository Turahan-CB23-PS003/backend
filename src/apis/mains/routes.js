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
  } else if (filename.includes("assets")) {
    const path = filename.split("assets")[1];
    return `assets${path}`;
  }
  else if (filename.includes(".")) {
    const path = filename.split("/");
    const ext = path[path.length - 1];
    return `${ext}`;
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
  {
    method: "GET",
    path: "/{filename}/{branchName*}",
    handler: (request, h) => {
      const { branchName } = request.params;
      const newFilename = fileNameHandler(branchName);
      const filePath = path.join(__dirname, "../../dist", newFilename);
      return h.file(filePath);
    },
  },
];

module.exports = { routes };
