import { Container } from "inversify";
import { AuthController } from "./app/controllers/auth-controllers";
import { TYPES } from "./types/injection";
import { AuthService } from "./app/services/auth-services";
import { IAuthRepository } from "./domain/interfaces/auth-interface";
import { PrismaAuthRepository } from "./domain/repositories/auth-repository";

const container = new Container();

container
  .bind<AuthController>(TYPES.AuthController)
  .to(AuthController)
  .inSingletonScope();

container
  .bind<AuthService>(TYPES.AuthService)
  .to(AuthService)
  .inSingletonScope();

container
  .bind<IAuthRepository>(TYPES.IAuthRepository)
  .to(PrismaAuthRepository)
  .inSingletonScope();

export { container };
