"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFound = exports.errorHandler = void 0;
const zod_1 = require("zod");
const errorHandler_1 = require("../utils/errorHandler");
const errorHandler = (error, req, res, next) => {
    // Log error for debugging
    console.error("Error occurred:", {
        message: (0, errorHandler_1.getErrorMessage)(error),
        stack: error instanceof Error ? error.stack : undefined,
        url: req.url,
        method: req.method,
        timestamp: new Date().toISOString(),
    });
    const statusCode = (0, errorHandler_1.getErrorStatus)(error);
    const message = (0, errorHandler_1.getErrorMessage)(error);
    // Don't leak error details in production
    const isDevelopment = process.env.NODE_ENV === "development";
    // Base response object
    const response = {
        success: false,
        message,
        ...(isDevelopment && {
            stack: error instanceof Error ? error.stack : undefined,
            details: error instanceof Error ? error.toString() : undefined,
        }),
    };
    // Add validation errors for Zod errors
    if (error instanceof zod_1.z.ZodError) {
        response.errors = (0, errorHandler_1.getZodValidationErrors)(error);
    }
    res.status(statusCode).json(response);
};
exports.errorHandler = errorHandler;
const notFound = (req, res, next) => {
    const error = new errorHandler_1.AppError(`Route ${req.originalUrl} not found`, 404);
    next(error);
};
exports.notFound = notFound;
