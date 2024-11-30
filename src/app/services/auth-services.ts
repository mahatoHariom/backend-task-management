import { injectable, inject } from "inversify";
import { PrismaAuthRepository } from "@/domain/repositories/auth-repository";
import { compare, hash } from "bcryptjs";
import { Messages, StatusCode } from "@/domain/constants/messages";
import { validateAccessToken } from "@/domain/utils/jwt";

import ApiError from "@/infrastructure/config/ApiError";
import { User } from "@prisma/client";
import { TYPES } from "@/types/injection";

interface AuthenticateRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  email: string;
  fullName: string;
  password: string;
}

@injectable()
export class AuthService {
  constructor(
    @inject(TYPES.IAuthRepository) private authRepository: PrismaAuthRepository
  ) {}

  async authenticate({
    email,
    password,
  }: AuthenticateRequest): Promise<User | null> {
    const user = await this.authRepository.findByEmail(email);
    if (!user) {
      throw new ApiError(Messages.USER_NOT_FOUND, StatusCode.Unauthorized);
    }

    const doesPasswordMatch = await compare(password, user?.password as string);

    if (!doesPasswordMatch) {
      throw new ApiError(Messages.PASSWORD_NOT_MATCHED, StatusCode.Forbidden);
    }

    return user;
  }

  async register({ email, fullName, password }: RegisterRequest) {
    const hashedPassword = await hash(password, 12);
    const user = await this.authRepository.create({
      email,
      fullName,
      password: hashedPassword,
    });
    return user;
  }

  async getProfileData(userId: string): Promise<User | null> {
    const user = await this.authRepository.findById(userId);
    return user;
  }

  async verifyRefreshToken(token: string) {
    const value = await validateAccessToken(token);
    return value;
  }
}
