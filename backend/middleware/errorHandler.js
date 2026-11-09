// backend/middleware/errorHandler.js

// 404 Not Found Handler
const notFoundHandler = (req, res, next) => {
    res.status(404).json({
        msg: `Route ${req.method} ${req.originalUrl} not found`
    });
};

// Central Error Handling Middleware
// Notice: must have 4 parameters (err, req, res, next) for Express to recognize as error handler
const errorHandler = (err, req, res, next) => {
    // Log error internally for debugging
    console.error('Unhandled error:', err.message || err);

    // Handle CORS error
    if (err.message === 'Not allowed by CORS') {
        return res.status(403).json({
            msg: 'Cross-Origin Request Blocked: Not allowed by CORS'
        });
    }

    // Handle JSON syntax error
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).json({
            msg: 'Invalid JSON payload format'
        });
    }

    // Handle Mongoose CastError (e.g. invalid ObjectId)
    if (err.name === 'CastError') {
        return res.status(404).json({
            msg: 'Resource not found'
        });
    }

    // Handle generic errors without leaking stack trace
    const statusCode = err.statusCode || res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode).json({
        msg: err.message || 'Internal Server Error'
    });
};

module.exports = {
    notFoundHandler,
    errorHandler
};
