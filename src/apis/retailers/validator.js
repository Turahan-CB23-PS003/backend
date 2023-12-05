const Joi = require("joi");
const pool = require("../../helpers/DatabasePool");
const { InvariantError } = require("../../helpers/ErrorsManager");

const getAdminId = async (retailerId) => {
  const resultGetAdminId = await _executeQuery({
    sql: "SELECT admin_id FROM retailers WHERE id = ?",
    values: [retailerId],
  });

  if (resultGetAdminId.length === 0) {
    throw new InvariantError("Admin not found");
  }

  return resultGetAdminId[0].admin_id;
};

const postRetailerSchema = Joi.object({
  name: Joi.string().required(),
  status: Joi.string().valid("active", "inactive").required(),
  openTime: Joi.string().required(),
  closeTime: Joi.string().required(),
  description: Joi.string(),
  location: Joi.string().required(),
  gmaps: Joi.string(),
  contact: Joi.string()
    .max(13)
    .pattern(/^[0-9]+$/)
    .message("Contact number must be a numeric value with less than 14 digits"),
  image: Joi.any(),
});

const patchRetailerSchema = Joi.object({
  name: Joi.string().required(),
  status: Joi.string().valid("active", "inactive").required(),
  openTime: Joi.string().required(),
  closeTime: Joi.string().required(),
  description: Joi.string(),
  location: Joi.string().required(),
  gmaps: Joi.string(),
  contact: Joi.string()
    .max(13)
    .pattern(/^[0-9]+$/)
    .message("Contact number must be a numeric value with less than 14 digits"),
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

module.exports = { postRetailerSchema, patchRetailerSchema, getAdminId };
