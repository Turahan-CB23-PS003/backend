const Joi = require("joi");

const postMealSchema = Joi.object({
  retailerId: Joi.number().required(),
  name: Joi.string().required(),
  description: Joi.string().required(),
  price: Joi.number().required(),
  status: Joi.string().valid("active", "inactive").required(),
  dateProduced: Joi.date().required(),
  expiryDate: Joi.date().required(),
  image: Joi.any(),
});

module.exports = ({
  postMealSchema,
});
