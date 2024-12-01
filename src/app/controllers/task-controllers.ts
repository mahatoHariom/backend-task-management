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

@injectable()
export class TaskController {
  constructor(
    @inject(TYPES.TaskService) private taskService: TaskService,
    @inject(TYPES.NotificationService)
    private notificationService: NotificationService
  ) {}

  async getTasks(req: Request<{}, {}, {}, GetTasksQuery>, res: Response) {
    const { search, page, limit, status, priority } = req.query;
    const userId = req.user?.id;

    const filter = { search, status, priority };
    const pageNumber = Number(page) || 1;
    const limitNumber = Number(limit) || 10;

    const tasks = await this.taskService.getTasks(
      userId as string,
      filter,
      pageNumber,
      limitNumber
    );

    res.status(StatusCode.Ok).json(tasks);
  }

  // Create task
  async createTask(req: Request<{}, {}, CreateTaskInput>, res: Response) {
    const task = await this.taskService.createTask(req.body);

    // Send CRUD notification
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

  // Update task
  async updateTask(req: Request<{}, {}, UpdateTaskInput>, res: Response) {
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

    // Send CRUD notification
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

  // Delete task
  async deleteTask(req: Request<{}, {}, DeleteTaskInput>, res: Response) {
    const { taskId } = req.body;
    const userId = req.user?.id;

    const task = await this.taskService.deleteTask(taskId, userId as string);

    if (!task) {
      res
        .status(StatusCode.NotFound)
        .json({ message: Messages.TASK_NOT_FOUND });
      return;
    }

    // Send CRUD notification
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

    res.status(StatusCode.Ok).json({ message: Messages.TASK_DELETED_SUCCESS });
  }
}

// import { Request, Response } from "express";
// import { inject, injectable } from "inversify";
// import { Messages, StatusCode } from "@/domain/constants/messages";
// import { TYPES } from "@/types/injection";
// import {
//   CreateTaskInput,
//   DeleteTaskInput,
//   GetTasksQuery,
//   UpdateTaskInput,
// } from "@/domain/schema/tasks-schema";
// import { TaskService } from "../services/task-service";

// @injectable()
// export class TaskController {
//   constructor(@inject(TYPES.TaskService) private taskService: TaskService) {}

//   // Create task
//   async createTask(req: Request<{}, {}, CreateTaskInput>, res: Response) {
//     const task = await this.taskService.createTask(req.body);
//     res.status(StatusCode.Created).json(task);
//   }

//   // Get tasks (with pagination and filters)
//   async getTasks(req: Request<{}, {}, {}, GetTasksQuery>, res: Response) {
//     const { search, page, limit, status, priority } = req.query;
//     const userId = req.user?.id;

//     const filter = { search, status, priority };
//     const pageNumber = Number(page) || 1;
//     const limitNumber = Number(limit) || 10;

//     const tasks = await this.taskService.getTasks(
//       userId as string,
//       filter,
//       (pageNumber - 1) * limitNumber,
//       limitNumber
//     );

//     res.status(StatusCode.Ok).json(tasks);
//   }

//   // Update task
//   async updateTask(req: Request<{}, {}, UpdateTaskInput>, res: Response) {
//     const { taskId, ...data } = req.body;
//     const userId = req.user?.id;

//     const task = await this.taskService.updateTask(
//       taskId,
//       data,
//       userId as string
//     );
//     if (!task) {
//       res
//         .status(StatusCode.NotFound)
//         .json({ message: Messages.TASK_NOT_FOUND });
//       return;
//     }

//     res.status(StatusCode.Ok).json(task);
//   }

//   // Delete task
//   async deleteTask(req: Request<{}, {}, DeleteTaskInput>, res: Response) {
//     const { taskId } = req.body;
//     const userId = req.user?.id;

//     const task = await this.taskService.deleteTask(taskId, userId as string);
//     if (!task) {
//       res
//         .status(StatusCode.NotFound)
//         .json({ message: Messages.TASK_NOT_FOUND });
//       return;
//     }

//     res.status(StatusCode.Ok).json({ message: Messages.TASK_DELETED_SUCCESS });
//   }
// }
