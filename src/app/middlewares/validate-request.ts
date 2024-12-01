import { z, ZodSchema } from "zod";
import { Request, Response, NextFunction } from "express";
import ApiError from "@/infrastructure/config/ApiError";
import { Messages, StatusCode } from "@/domain/constants/messages";

export const validateRequest = (
  schema: ZodSchema,
  source: "body" | "query" = "body" // Specify the source of validation
) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      // Dynamically select the source of validation
      schema.parse(source === "body" ? req.body : req.query);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Handle validation error
        throw new ApiError(Messages.VALIDATION_ERROR, StatusCode.BadRequest, {
          errors: error.errors,
        });
      }
      // Handle other types of errors
      throw new ApiError(
        Messages.INTERNAL_SERVER_ERROR,
        StatusCode.InternalServerError
      );
    }
  };
};
