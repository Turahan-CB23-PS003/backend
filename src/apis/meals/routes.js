/* global __dirname */

const path = require("path");
const { routing } = require("../../helpers/Routing");
const {
  postMeal,
  patchMeal,
  getSingleMeal,
  getAllMeals,
  getAllMealsImage,
  deleteMeal,
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
    path: `${routing}/meals/{retailerId}`,
    handler: getAllMeals,
  },
  {
    method: "GET",
    path: `${routing}/meals/images/{retailerId}`,
    handler: getAllMealsImage,
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
    path: "/assets/img/pexels-engin-akyurt-1907642.jpg",
    handler: (request, h) => {
      return h.file(
        path.join(
          __dirname,
          "../../assets/img",
          "pexels-engin-akyurt-1907642.jpg",
        ),
      );
    },
  },
];

module.exports = { routes };
