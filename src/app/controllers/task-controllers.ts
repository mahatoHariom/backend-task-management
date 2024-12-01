import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { Messages, StatusCode } from "@/domain/constants/messages";
import { TYPES } from "@/types/injection";
import {
  CreateTaskInput,
  DeleteTaskInput,
  GetTasksQuery,
  UpdateTaskInput,
} from "@/domain/schema/tasks-schema";
import { TaskService } from "../services/task-service";
import { NotificationService } from "../services/notification-service";
import {
  CRUDAction,
  NotificationType,
  Notification,
} from "@/types/notification";
import { asyncHandler } from "../middlewares/async-handler";

@injectable()
export class TaskController {
  constructor(
    @inject(TYPES.TaskService) private taskService: TaskService,
    @inject(TYPES.NotificationService)
    private notificationService: NotificationService
  ) {}

  getTasks = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;

    // Normalize query parameters to `string | undefined`
    const search =
      typeof req.query.search === "string" ? req.query.search : undefined;
    const status =
      typeof req.query.status === "string" ? req.query.status : undefined;
    const priority =
      typeof req.query.priority === "string" ? req.query.priority : undefined;

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const filter = { search, status, priority };

    // Pass the normalized filter to the service
    const tasks = await this.taskService.getTasks(
      userId as string,
      filter,
      page,
      limit
    );

    res.status(StatusCode.Ok).json(tasks);
  });

  createTask = asyncHandler(
    async (req: Request<{}, {}, CreateTaskInput>, res: Response) => {
      const task = await this.taskService.createTask(req.body);

      const notification: Notification = {
        id: crypto.randomUUID(), // Generate a unique ID
        type: NotificationType.CRUD,
        action: CRUDAction.CREATE,
        taskId: task.id,
        userId: task.userId,
        title: "Task Created",
        message: `Task "${task.title}" has been created`,
        timestamp: new Date(),
        isRead: false, // Default value
        dueDate: task.dueDate,
      };

      await this.notificationService.sendNotification(notification);

      res.status(StatusCode.Created).json(task);
    }
  );

  updateTask = asyncHandler(
    async (req: Request<{}, {}, UpdateTaskInput>, res: Response) => {
      const { taskId, ...data } = req.body;
      const userId = req.user?.id;

      const task = await this.taskService.updateTask(
        taskId,
        data,
        userId as string
      );

      if (!task) {
        res
          .status(StatusCode.NotFound)
          .json({ message: Messages.TASK_NOT_FOUND });
        return;
      }

      const notification = {
        id: crypto.randomUUID(), // Generate a unique ID
        type: NotificationType.CRUD,
        action: CRUDAction.UPDATE,
        taskId: task.id,
        userId: task.userId,
        title: "Task Updated",
        message: `Task "${task.title}" has been updated`,
        timestamp: new Date(),
        isRead: false, // Default value
        dueDate: task.dueDate,
      };

      await this.notificationService.sendNotification(notification);

      res.status(StatusCode.Ok).json(task);
    }
  );

  deleteTask = asyncHandler(
    async (req: Request<{}, {}, DeleteTaskInput>, res: Response) => {
      const { taskId } = req.body;
      const userId = req.user?.id;

      const task = await this.taskService.deleteTask(taskId, userId as string);

      if (!task) {
        res
          .status(StatusCode.NotFound)
          .json({ message: Messages.TASK_NOT_FOUND });
        return;
      }

      const notification = {
        id: crypto.randomUUID(), // Generate a unique ID
        type: NotificationType.CRUD,
        action: CRUDAction.DELETE,
        taskId: task.id,
        userId: task.userId,
        title: "Task Deleted",
        message: `Task "${task.title}" has been deleted`,
        timestamp: new Date(),
        isRead: false, // Default value
        dueDate: task.dueDate,
      };

      await this.notificationService.sendNotification(notification);

      res
        .status(StatusCode.Ok)
        .json({ message: Messages.TASK_DELETED_SUCCESS });
    }
  );
}
