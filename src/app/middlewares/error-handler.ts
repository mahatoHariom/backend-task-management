import ApiError from "@/infrastructure/config/ApiError";
import { logger } from "@/infrastructure/config/winston";
import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

// Type guard to check if error is a ZodError
function isZodError(error: any): error is ZodError {
  return error instanceof ZodError;
}

export const errorHandler = (
  error: ApiError | Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error(error.message); // Log the error using the logger

  if (error instanceof ApiError) {
    // Handle custom ApiError
    res.status(error.statusCode).json({
      statusCode: error.statusCode,
      error: error.statusMessage,
      message: error.message,
      ...(error.details && { details: error.details }), // Handle additional info like validation errors
    });
  } else if (isZodError(error)) {
    // If error is a ZodError, safely access its 'errors' property
    res.status(400).json({
      statusCode: 400,
      error: "Validation Error",
      message: "Invalid request data",
      errors: error.errors, // Now TypeScript knows 'error' has an 'errors' property
    });
  } else if ((error as any).code === "P2002") {
    res.status(409).json({
      statusCode: 409,
      error: "Conflict",
      message: "A record with the same unique field already exists",
    });
  } else {
    res.status(500).json({
      statusCode: 500,
      error: "Internal Server Error",
      message: "An unexpected error occurred",
    });
  }
};
