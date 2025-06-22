"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppError = void 0;
exports.getErrorMessage = getErrorMessage;
exports.getErrorStatus = getErrorStatus;
exports.getZodValidationErrors = getZodValidationErrors;
exports.createValidationError = createValidationError;
const zod_1 = require("zod");
class AppError extends Error {
    constructor(message, statusCode = 500) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.AppError = AppError;
function getErrorMessage(error) {
    // Handle Zod validation errors
    if (error instanceof zod_1.z.ZodError) {
        return "Validation failed";
    }
    if (error instanceof Error) {
        // Handle MongoDB specific errors
        if (error.name === "ValidationError") {
            return `Validation Error: ${error.message}`;
        }
        if (error.name === "CastError") {
            return "Invalid ID format";
        }
        if (error.name === "MongoServerError") {
            // Handle duplicate key errors
            if ("code" in error && error.code === 11000) {
                return "Duplicate entry - this record already exists";
            }
            return "Database server error";
        }
        if (error.name === "JsonWebTokenError") {
            return "Invalid token";
        }
        if (error.name === "TokenExpiredError") {
            return "Token expired";
        }
        return error.message;
    }
    if (typeof error === "string")
        return error;
    return "An unknown error occurred";
}
function getErrorStatus(error) {
    // Handle Zod validation errors
    if (error instanceof zod_1.z.ZodError) {
        return 400;
    }
    if (error instanceof AppError)
        return error.statusCode;
    if (error instanceof Error) {
        // Handle specific error types
        switch (error.name) {
            case "ValidationError":
                return 400;
            case "CastError":
                return 400;
            case "JsonWebTokenError":
                return 401;
            case "TokenExpiredError":
                return 401;
            case "MongoServerError":
                // Handle duplicate key errors
                if ("code" in error && error.code === 11000) {
                    return 409; // Conflict
                }
                return 500;
            default:
                return 500;
        }
    }
    return 500;
}
// Add this new function to format Zod validation errors
function getZodValidationErrors(error) {
    return error.errors.map((err) => ({
        field: err.path.join("."),
        message: err.message,
        code: err.code,
    }));
}
// Optional: Helper function to create validation errors manually
function createValidationError(field, message, code = "custom") {
    return new zod_1.z.ZodError([
        {
            code: code,
            path: [field],
            message: message,
        },
    ]);
}
