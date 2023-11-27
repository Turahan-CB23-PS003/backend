const Joi = require("joi");
const pool = require("../../helpers/DatabasePool");
const { AuthorizationError } = require("../../helpers/ErrorsManager");

const isRetailerExist = async (retailerId, adminId) => {
  const resultIsRetailerExist = await _executeQuery({
    sql: "SELECT * FROM retailers WHERE admin_id = ? AND id = ?",
    values: [adminId, retailerId],
  });

  if (resultIsRetailerExist.length === 0) {
    throw new AuthorizationError("Retailer not found");
  }
};

const postMealSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
  price: Joi.number().required(),
  status: Joi.string().valid("active", "inactive").required(),
  dateProduced: Joi.date().required(),
  expiryDate: Joi.date().required(),
  image: Joi.any(),
});

const patchMealSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
  price: Joi.number().required(),
  status: Joi.string().valid("active", "inactive").required(),
  dateProduced: Joi.date().required(),
  expiryDate: Joi.date().required(),
  image: Joi.any(),
});

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
  postMealSchema,
  patchMealSchema,
  isRetailerExist
};
