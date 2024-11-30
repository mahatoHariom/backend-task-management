import { Container } from "inversify";
import { PrismaAuthRepository } from "@/domain/repositories/auth-repository";
import { AuthController } from "@/app/controllers/auth-controllers";
import { TYPES } from "./types/injection";
import { AuthService } from "./app/services/auth-services";
import { IAuthRepository } from "./domain/interfaces/auth-interface";
import { TaskController } from "./app/controllers/task-controllers";
import { TaskService } from "./app/services/task-service";
import { ITaskRepository } from "./domain/interfaces/task-interface";
import { PrismaTaskRepository } from "./domain/repositories/task-repository";
import { NotificationService } from "./app/services/notification-service";
import { OverdueTaskService } from "./app/services/over-due-task-service";

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

// Setup for the Tasks

container
  .bind<TaskController>(TYPES.TaskController)
  .to(TaskController)
  .inSingletonScope();

container
  .bind<NotificationService>(TYPES.NotificationService)
  .to(NotificationService)
  .inSingletonScope();
container
  .bind<OverdueTaskService>(TYPES.OverdueTaskService)
  .to(OverdueTaskService)
  .inSingletonScope();

container
  .bind<TaskService>(TYPES.TaskService)
  .to(TaskService)
  .inSingletonScope();
container
  .bind<ITaskRepository>(TYPES.ITaskRepository)
  .to(PrismaTaskRepository)
  .inSingletonScope();

export { container };
