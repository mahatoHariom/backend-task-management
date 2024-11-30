import { z, ZodTypeAny } from "zod";
import { Request, Response, NextFunction } from "express";
import ApiError from "@/infrastructure/config/ApiError";
import { Messages, StatusCode } from "@/domain/constants/messages";

export const validateRequest = (schema: ZodTypeAny) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new ApiError(Messages.VALIDATION_ERROR, StatusCode.BadRequest, {
          errors: error.errors,
        });
      }
      throw new ApiError(
        Messages.INTERNAL_SERVER_ERROR,
        StatusCode.InternalServerError
      );
    }
  };
};
