// backend/middleware/validate.js
const { z } = require('zod');

const validate = (schema) => (req, res, next) => {
    try {
        req.body = schema.parse(req.body);
        next();
    } catch (err) {
        if (err instanceof z.ZodError) {
            const errors = err.issues.map(issue => ({
                field: issue.path.join('.'),
                message: issue.message
            }));
            return res.status(400).json({
                msg: errors[0]?.message || 'Validation error',
                errors
            });
        }
        next(err);
    }
};

module.exports = validate;
