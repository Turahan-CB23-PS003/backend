const pool = require("../../helpers/DatabasePool");
const { InvariantError, handleError } = require("../../helpers/ErrorsManager");
const { imageToBlob } = require("../../helpers/ImageConverter");
const {
  postMealSchema,
  patchMealSchema,
  isRetailerExist,
} = require("./validator");

const postMeal = async (request, h) => {
  try {
    const { retailerId } = request.params;
    const { id: adminId } = request.auth.credentials;

    await isRetailerExist(retailerId, adminId);

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

const patchMeal = async (request, h) => {
  try {
    const { retailerId } = request.params;
    const { mealId } = request.params;
    const { id: adminId } = request.auth.credentials;

    await isRetailerExist(retailerId, adminId);

    const { error = undefined } = patchMealSchema.validate(request.payload);

    if (error) {
      throw new InvariantError(error.message);
    }

    const { image, ...restPayload } = request.payload;

    const imageBlob = image ? await imageToBlob(image) : null;

    const resultPatchMeal = await _executeQuery({
      sql: "UPDATE meals SET name = ?, description = ?, price = ?, status = ?, date_produced = ?, expiry_date = ?, image = ? WHERE id = ?",
      values: [...Object.values(restPayload), imageBlob, mealId],
    });

    if (resultPatchMeal.length === 0) {
      throw new InvariantError("Fail to update meal");
    }

    const response = h.response({
      status: "success",
      message: "Meal successfully updated",
      data: {
        meals: { ...restPayload },
      },
    });
    response.code(200);
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
    const resultgetAllMeals = await _executeQuery({
      sql: "SELECT id, retailer_id, name, description, price, status, date_produced, expiry_date FROM meals WHERE retailer_id = ?",
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
    const resultgetAllMealsImage = await _executeQuery({
      sql: "SELECT id, retailer_id, image FROM meals WHERE retailer_id = ?",
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

const deleteMeal = async (request, h) => {
  try {
    const { retailerId } = request.params;
    const { mealId } = request.params;
    const { id: adminId } = request.auth.credentials;

    await isRetailerExist(retailerId, adminId);

    const resultDeleteMeal = await _executeQuery({
      sql: "DELETE FROM meals WHERE id = ?",
      values: [mealId],
    });

    if (resultDeleteMeal.affectedRows < 0) {
      throw new InvariantError("Fail to delete meal");
    }

    const response = h.response({
      status: "success",
      message: "Meal successfully deleted",
      data: {
        meals: {
          id: mealId,
        },
      },
    });
    response.code(200);
    return response;
  } catch (error) {
    return handleError(error, h);
  }
};

const getRetailersAllMeals = async (request, h) => {
  try {
    const { retailerId } = request.params;

    const resultgetRetailersAllMeals = await _executeQuery({
      sql: "SELECT id, retailer_id, name, description, price, status, date_produced, expiry_date FROM meals WHERE retailer_id = ?",
      values: [retailerId],
    });

    const response = h.response({
      status: "success",
      message: "Meals successfully retrieved",
      data: {
        meals: resultgetRetailersAllMeals,
      },
    });
    response.code(200);
    return response;
  } catch (error) {
    return handleError(error, h);
  }
};

const getRetailersAllMealsImage = async (request, h) => {
  try {
    const { retailerId } = request.params;

    const resultgetRetailersAllMealsImage = await _executeQuery({
      sql: "SELECT id, retailer_id, image FROM meals WHERE retailer_id = ?",
      values: [retailerId],
    });

    const response = h.response({
      status: "success",
      message: "Meals image successfully retrieved",
      data: {
        meals: resultgetRetailersAllMealsImage,
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

module.exports = {
  postMeal,
  patchMeal,
  getSingleMeal,
  getAllMeals,
  getAllMealsImage,
  deleteMeal,
  getRetailersAllMeals,
  getRetailersAllMealsImage,
};
