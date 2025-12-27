import Joi from 'joi';

export const signUpSchema = Joi.object({
  firstName: Joi.string().required().min(3).max(20).trim(),
  middleName: Joi.string().allow('', null).trim(),
  lastName: Joi.string().required().min(3).max(30).trim(),
  secondLastname: Joi.string().required().min(3).max(30).trim(),

  documentId: Joi.number().integer().positive().required(),
  age: Joi.number().integer().min(18).max(120).required(),

  address: Joi.string().required().trim(),
  department: Joi.string().required().trim(),
  city: Joi.string().required().trim(),

  phone: Joi.number().integer().required(),
  email: Joi.string().email().required().lowercase().trim(),
  password: Joi.string().required().min(8),

  // Optionals for the admin
  active: Joi.boolean().default(true),
  termsAndConditions: Joi.boolean().default(false)
});

export const signInSchema = Joi.object({
  email: Joi.string().email().required().lowercase().trim(),
  password: Joi.string().required()
});

export const updateUserSchema = signUpSchema.fork(
  [
    'firstName', 'lastName', 'secondLastname', 'documentId', 'age', 'address',
    'department', 'city',   'phone',  'email', 'password'
  ], (field) => field.optional()
);