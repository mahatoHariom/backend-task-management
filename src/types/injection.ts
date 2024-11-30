export const TYPES = {
  AuthController: Symbol.for("AuthController"),
  TaskController: Symbol.for("TaskController"),

  AuthService: Symbol.for("AuthService"),
  TaskService: Symbol.for("TaskService"),
  NotificationService: Symbol.for("NotificationService"),
  OverdueTaskService: Symbol.for("OverdueTaskService"),

  PrismaAuthRepository: Symbol.for("PrismaAuthRepository"),
  PrismaTaskRepository: Symbol.for("PrismaTaskRepository"),

  IAuthRepository: Symbol.for("IAuthRepository"),
  ITaskRepository: Symbol.for("ITaskRepository"),

  PrismaClient: Symbol.for("PrismaClient"),
  PrismaService: Symbol.for("PrismaService"),
};
