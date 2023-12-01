const path = require("path");
const { routing } = require("../../helpers/Routing");
const {
  postMeal,
  patchMeal,
  getSingleMeal,
  getAllMeals,
  deleteMeal,
  getRetailersAllMeals,
} = require("./handler");

const routes = [
  {
    method: "POST",
    path: `${routing}/meals/{retailerId}`,
    handler: postMeal,
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
    path: `${routing}/meals/{retailerId}/{mealId}`,
    handler: patchMeal,
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
    path: `${routing}/meals/{retailerId}/{mealId}`,
    handler: getSingleMeal,
  },
  {
    method: "GET",
    path: `${routing}/meals`,
    handler: getAllMeals,
  },
  {
    method: "DELETE",
    path: `${routing}/meals/{retailerId}/{mealId}`,
    handler: deleteMeal,
    options: {
      auth: "auth_jwt",
    },
  },
  {
    method: "GET",
    path: `${routing}/meals/{retailerId}`,
    handler: getRetailersAllMeals,
  },
  {
    method: "GET",
    path: "/img/meals/{filename}",
    handler: (request, h) => {
      const { filename } = request.params;
      const filePath = path.join(__dirname, "../../assets/img/meals", filename);
      return h.file(filePath);
    },
  },
];

module.exports = { routes };
