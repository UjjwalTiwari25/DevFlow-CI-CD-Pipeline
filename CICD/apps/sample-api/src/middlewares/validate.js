const { ValidationError } = require('../utils/errors');

/**
 * Factory function that creates a validation middleware for a given Zod schema.
 *
 * @param {import('zod').ZodSchema} schema - Zod validation schema
 * @param {'body' | 'query' | 'params'} source - Which part of the request to validate
 * @returns {Function} Express middleware function
 */
function validate(schema, source = 'body') {
  return (req, res, next) => {
    try {
      const result = schema.parse(req[source]);
      req[source] = result; // Replace with parsed (and potentially transformed) data
      next();
    } catch (error) {
      if (error.name === 'ZodError') {
        const errors = error.errors.map((e) => ({
          field: e.path.join('.'),
          message: e.message,
        }));
        next(new ValidationError('Validation failed', errors));
      } else {
        next(error);
      }
    }
  };
}

module.exports = { validate };
