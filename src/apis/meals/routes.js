/* global __dirname */

const path = require("path");
const { routing } = require("../../helpers/Routing");
const { postMeal, getSingleMeal, getAllMeals, getAllMealsImage } = require("./handler");

const routes = [
  {
    method: "POST",
    path: `${routing}/meals`,
    handler: postMeal,
    options: {
      payload: {
        output: "stream",
        parse: true,
        multipart: true,
        maxBytes: 10 * 1024 * 1024,
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
