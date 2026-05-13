export const notFoundMiddleware = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
};

export const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || res.statusCode || 500;

    // Handle Mongoose errors
    if (err.name === 'CastError' && err.kind === 'ObjectId') {
        return res.status(404).json({
            success: false,
            message: 'Resource not found'
        });
    }

    if (err.name === 'ValidationError') {
        return res.status(400).json({
            success: false,
            message: err.message || 'Validation error'
        });
    }

    // Generic error response
    res.status(statusCode).json({
        success: false,
        message: err.message || 'Internal Server Error'
    });
};