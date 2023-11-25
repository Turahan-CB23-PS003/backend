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
    const { error = undefined } = postMealSchema.validate(request.payload);

    if (error) {
      throw new InvariantError(error.message);
    }

    const {
      retailerId,
      name,
      description,
      price,
      status,
      dateProduced,
      expiryDate,
      image,
    } = request.payload;

    const imageBlob = image ? await imageToBlob(image) : null;

    const resultPostMeal = await _executeQuery({
      sql: "INSERT INTO meals(retailer_id, name, description, price, status, date_produced, expiry_date, image) VALUES(?, ?, ?, ?, ?, ?, ?, ?)",
      values: [
        retailerId,
        name,
        description,
        price,
        status,
        dateProduced,
        expiryDate,
        imageBlob,
      ],
    });
    if (resultPostMeal.length === 0) {
      throw new InvariantError("Fail to add meal");
    }

    const response = h.response({
      status: "success",
      message: "Meal successfully added",
      data: {
        retailerId,
        name,
        description,
        price,
        status,
        dateProduced,
        expiryDate,
      },
    });
    response.code(201);
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

module.exports = { postMeal };
