import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { generateJsonWebToken, generateRefreshToken } from "@/domain/utils/jwt";
import ApiError from "@/infrastructure/config/ApiError";
import { Messages, StatusCode } from "@/domain/constants/messages";
import { TYPES } from "@/types/injection";
import { asyncHandler } from "../middlewares/async-handler";
import { AuthService } from "../services/auth-services";
import { CreateUserInput, LoginUserInput } from "@/domain/schema/auth-schemas";

@injectable()
export class AuthController {
  constructor(@inject(TYPES.AuthService) private authService: AuthService) {}

  authenticate = asyncHandler(
    async (req: Request<{}, {}, LoginUserInput>, res: Response) => {
      const { email, password } = req.body;
      const user = await this.authService.authenticate({ email, password });

      if (!user) {
        throw new ApiError(
          Messages.INVALID_CREDENTIAL,
          StatusCode.Unauthorized
        );
      }

      const refreshToken = generateRefreshToken(user);
      const accessToken = generateJsonWebToken(user);

      res
        .cookie("user", JSON.stringify(user), {
          path: "/",
          secure: false,
          sameSite: "strict",
          httpOnly: true,
        })
        .status(200)
        .json({ accessToken, refreshToken, user });
    }
  );

  register = asyncHandler(
    async (req: Request<{}, {}, CreateUserInput>, res: Response) => {
      const { email, fullName, password } = req.body;
      const user = await this.authService.register({
        email,
        fullName,
        password,
      });
      res.status(201).json(user);
    }
  );

  refresh = asyncHandler(
    async (req: Request<{}, {}, { refreshToken: string }>, res: Response) => {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        throw new ApiError(Messages.USER_NOT_FOUND, StatusCode.NotFound);
      }

      const data = await this.authService.verifyRefreshToken(refreshToken);

      if (!data) {
        throw new ApiError(
          Messages.INVALID_OR_TOKEN_EXPIRES,
          StatusCode.Unauthorized
        );
      }

      const user = await this.authService.getProfileData(data.id);

      if (!user) {
        throw new ApiError(Messages.USER_NOT_FOUND, StatusCode.NotFound);
      }

      const accessToken = generateJsonWebToken(user);

      res.status(200).json({ accessToken });
    }
  );
}
