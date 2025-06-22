import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { AppError, getErrorMessage, getErrorStatus, getZodValidationErrors } from "../utils/errorHandler";

export const errorHandler = (error: unknown, req: Request, res: Response, next: NextFunction) => {
  // Log error for debugging
  console.error("Error occurred:", {
    message: getErrorMessage(error),
    stack: error instanceof Error ? error.stack : undefined,
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString(),
  });

  const statusCode = getErrorStatus(error);
  const message = getErrorMessage(error);

  // Don't leak error details in production
  const isDevelopment = process.env.NODE_ENV === "development";

  // Base response object
  const response: any = {
    success: false,
    message,
    ...(isDevelopment && {
      stack: error instanceof Error ? error.stack : undefined,
      details: error instanceof Error ? error.toString() : undefined,
    }),
  };

  // Add validation errors for Zod errors
  if (error instanceof z.ZodError) {
    response.errors = getZodValidationErrors(error);
  }

  res.status(statusCode).json(response);
};

export const notFound = (req: Request, res: Response, next: NextFunction) => {
  const error = new AppError(`Route ${req.originalUrl} not found`, 404);
  next(error);
};
