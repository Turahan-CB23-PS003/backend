const pool = require("../../helpers/DatabasePool");
const {
  // ClientError,
  // AuthenticationError,
  // AuthorizationError,
  InvariantError,
  // NotFoundError,
  // ServerError,
  handleError,
} = require("../../helpers/ErrorsManager");
const { imageToBlob } = require("../../helpers/ImageConverter");
const { postMealSchema } = require("./validator");

const postMeal = async (request, h) => {
  try {
    const { id: retailerId } = request.auth.credentials;
    const { error = undefined } = postMealSchema.validate(request.payload);

    if (error) {
      throw new InvariantError(error.message);
    }

    const { image, ...restPayload } = request.payload;

    const imageBlob = image ? await imageToBlob(image) : null;

    const resultPostMeal = await _executeQuery({
      sql: "INSERT INTO meals(retailer_id, name, description, price, status, date_produced, expiry_date, image) VALUES(?, ?, ?, ?, ?, ?, ?, ?)",
      values: [retailerId, ...Object.values(restPayload), imageBlob],
    });

    if (resultPostMeal.length === 0) {
      throw new InvariantError("Fail to add meal");
    }

    const response = h.response({
      status: "success",
      message: "Meal successfully added",
      data: {
        meals: { ...restPayload },
      },
    });
    response.code(201);
    return response;
  } catch (error) {
    return handleError(error, h);
  }
};

const getSingleMeal = async (request, h) => {
  try {
    const { mealId } = request.params;

    const resultgetSingleMeal = await _executeQuery({
      sql: "SELECT * FROM meals WHERE id = ?",
      values: [mealId],
    });

    if (resultgetSingleMeal.length === 0) {
      throw new InvariantError("Meal not found");
    }

    const response = h.response({
      status: "success",
      message: "Meal successfully retrieved",
      data: {
        meals: resultgetSingleMeal[0],
      },
    });
    response.code(200);
    return response;
  } catch (error) {
    return handleError(error, h);
  }
};

const getAllMeals = async (request, h) => {
  try {
    const { retailerId } = request.params;

    const resultgetAllMeals = await _executeQuery({
      sql: "SELECT id, retailer_id, name, description, price, status, date_produced, expiry_date FROM meals WHERE retailer_id = ?",
      values: [retailerId],
    });

    const response = h.response({
      status: "success",
      message: "Meals successfully retrieved",
      data: {
        meals: resultgetAllMeals,
      },
    });
    response.code(200);
    return response;
  } catch (error) {
    return handleError(error, h);
  }
};

const getAllMealsImage = async (request, h) => {
  try {
    const { retailerId } = request.params;

    const resultgetAllMealsImage = await _executeQuery({
      sql: "SELECT id, retailer_id, image FROM meals WHERE retailer_id = ?",
      values: [retailerId],
    });

    const response = h.response({
      status: "success",
      message: "Meals image successfully retrieved",
      data: {
        meals: resultgetAllMealsImage,
      },
    });
    response.code(200);
    return response;
  } catch (error) {
    return handleError(error, h);
  }
};

const _executeQuery = (query) => {
  return new Promise((resolve, reject) => {
    pool.query(query, (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
};

module.exports = { postMeal, getSingleMeal, getAllMeals, getAllMealsImage };
