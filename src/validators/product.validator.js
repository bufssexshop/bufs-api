import Joi from 'joi';

export const productSchema = Joi.object({
  code: Joi.string().required().trim(),
  name: Joi.string().required().min(3).max(100).trim(),
  price: Joi.number().positive().required(),
  creditPrice: Joi.number().min(0).required(),
  details: Joi.string().required().min(10),
  category: Joi.string().required(),
  subcategory: Joi.string().required(),
  // Optionals
  available: Joi.boolean().default(true),
  promotion: Joi.boolean().default(false),
  promotionValue: Joi.number().min(0).default(0)
});

export const updateProductSchema = productSchema.fork(
  ['code', 'name', 'price', 'creditPrice', 'details', 'category', 'subcategory'],
  (field) => field.optional()
);