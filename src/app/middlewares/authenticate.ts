import ApiError from "@/infrastructure/config/ApiError";
import { validateAccessToken } from "@/domain/utils/jwt";
import { User } from "@prisma/client";
import { Request, Response, NextFunction } from "express";
import { Messages, StatusCode } from "@/domain/constants/messages";

const authenticateJWT = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Retrieve the authorization header
  const token = req.headers.authorization;

  // Check if token is present
  if (!token) {
    return next(
      new ApiError(Messages.TOKEN_NOT_FOUND, StatusCode.Unauthorized)
    );
  }

  // Extract the access token (Bearer <token>)
  const accessToken = token.split(" ")[1];

  // If access token is missing after 'Bearer', return an error
  if (!accessToken) {
    return next(
      new ApiError(Messages.TOKEN_NOT_FOUND, StatusCode.Unauthorized)
    );
  }

  try {
    // Validate and decode the token
    const decoded = await validateAccessToken(accessToken);

    // If token is invalid or expired, return an error
    if (!decoded) {
      return next(
        new ApiError(Messages.INVALID_OR_TOKEN_EXPIRES, StatusCode.Unauthorized)
      );
    }

    // Attach the decoded user data to req.user
    req.user = decoded as User;

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    // In case of an error, pass it to the error handler
    return next(
      new ApiError(Messages.INVALID_OR_TOKEN_EXPIRES, StatusCode.Unauthorized)
    );
  }
};

export default authenticateJWT;
