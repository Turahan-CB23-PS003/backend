const Joi = require("joi");

const postRetailerSchema = Joi.object({
  name: Joi.string().required(),
  status: Joi.string().valid("active", "inactive").required(),
  open_time: Joi.string().required(),
  close_time: Joi.string().required(),
  location: Joi.string().required(),
  gmaps: Joi.string(),
  contact: Joi.string()
    .pattern(/^[0-9]{14}$/)
    .message("Contact number must be below 14-digit numeric value")
    .required(),
  image: Joi.any(),
  banner_image: Joi.any(),
});

const patchRetailerSchema = Joi.object({
  name: Joi.string().required(),
  status: Joi.string().valid("active", "inactive").required(),
  open_time: Joi.string().required(),
  close_time: Joi.string().required(),
  location: Joi.string().required(),
  gmaps: Joi.string(),
  contact: Joi.string()
    .pattern(/^[0-9]{14}$/)
    .message("Contact number must be below 14-digit numeric value"),
  image: Joi.any(),
  banner_image: Joi.any(),
});

module.exports = { postRetailerSchema, patchRetailerSchema };
