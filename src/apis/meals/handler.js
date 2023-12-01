const pool = require("../../helpers/DatabasePool");
const { InvariantError, handleError } = require("../../helpers/ErrorsManager");
const {
  postMealSchema,
  patchMealSchema,
  isRetailerExist,
} = require("./validator");
const { uploadImage, deleteImage } = require("../../helpers/ImageConverter");

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
    const fileName = image
      ? await uploadImage({ adminId, image, table: "meals" })
      : null;

    const resultPostMeal = await _executeQuery({
      sql: "INSERT INTO meals(retailer_id, name, description, price, status, date_produced, expiry_date, image) VALUES(?, ?, ?, ?, ?, ?, ?, ?)",
      values: [retailerId, ...Object.values(restPayload), fileName],
    });

    if (resultPostMeal.length === 0) {
      throw new InvariantError("Fail to add meal");
    }

    const response = h.response({
      status: "success",
      message: "Meal successfully added",
      data: {
        meals: { ...restPayload, image: fileName },
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
    await deleteImage(mealId, "meals");
    const fileName = image
      ? await uploadImage({ adminId, image, table: "meals" })
      : null;

    const resultPatchMeal = await _executeQuery({
      sql: "UPDATE meals SET name = ?, description = ?, price = ?, status = ?, date_produced = ?, expiry_date = ?, image = ? WHERE id = ?",
      values: [...Object.values(restPayload), fileName, mealId],
    });

    if (resultPatchMeal.length === 0) {
      throw new InvariantError("Fail to update meal");
    }

    const response = h.response({
      status: "success",
      message: "Meal successfully updated",
      data: {
        meals: { ...restPayload, image: fileName },
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

    const resultGetSingleMeal = await _executeQuery({
      sql: "SELECT * FROM meals WHERE id = ?",
      values: [mealId],
    });

    if (resultGetSingleMeal.length === 0) {
      throw new InvariantError("Meal not found");
    }

    const response = h.response({
      status: "success",
      message: "Meal successfully retrieved",
      data: {
        meals: resultGetSingleMeal[0],
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
    const resultGetAllMeals = await _executeQuery({
      sql: "SELECT * FROM meals",
    });

    const resultGetAllRetailers = await _executeQuery({
      sql: "SELECT * FROM retailers",
    });

    if (resultGetAllRetailers.length === 0) {
      throw new InvariantError("No retailer found");
    }

    const meals = resultGetAllMeals.map((meal) => {
      const retailer = resultGetAllRetailers.find(
        (retailer) => retailer.id === meal.retailer_id,
      );
      return { ...meal, retailer };
    });

    const response = h.response({
      status: "success",
      message: "Meals successfully retrieved",
      data: {
        meals,
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
    await deleteImage(mealId, "meals");

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

    const resultGetRetailersAllMeals = await _executeQuery({
      sql: "SELECT * FROM meals WHERE retailer_id = ?",
      values: [retailerId],
    });

    const resultGetAllRetailers = await _executeQuery({
      sql: "SELECT * FROM retailers WHERE id = ?",
      values: [retailerId],
    });

    if (resultGetAllRetailers.length === 0) {
      throw new InvariantError("No retailer found");
    }

    const meals = resultGetRetailersAllMeals.map((meal) => {
      const retailer = resultGetAllRetailers.find(
        (retailer) => retailer.id === meal.retailer_id,
      );
      return { ...meal, retailer };
    });

    const response = h.response({
      status: "success",
      message: "Meals successfully retrieved",
      data: {
        meals,
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
  deleteMeal,
  getRetailersAllMeals,
};
