export const validateResource = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, {
    abortEarly: false, // Show all errors on time, not only the first
    stripUnknown: true // Delete fields that doesn't exists in the scheme (extra securuty)
  });

  if (error) {
    error.isJoi = true
    return next(error)
  }

  next();
};