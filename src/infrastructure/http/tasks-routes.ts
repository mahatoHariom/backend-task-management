import express from "express";
import {
  createTaskSchema,
  deleteTaskSchema,
  getTasksQuerySchema,
  updateTaskSchema,
} from "@/domain/schema/tasks-schema";
import { container } from "@/container";
import { TYPES } from "@/types/injection";
import { TaskController } from "@/app/controllers/task-controllers";
import { validateRequest } from "@/app/middlewares/validate-reques";
import authenticateJWT from "@/app/middlewares/authenticate";

const router = express.Router();
const taskController = container.get<TaskController>(TYPES.TaskController);

// Create task (with authentication and validation)
router.post(
  "/tasks",
  authenticateJWT,
  validateRequest(createTaskSchema),
  taskController.createTask.bind(taskController),
);

// Get tasks (with authentication and query validation)
router.get(
  "/tasks",
  authenticateJWT,
  validateRequest(getTasksQuerySchema, "query"),
  taskController.getTasks.bind(taskController),
);

// Update task (with authentication and validation)
router.put(
  "/tasks",
  authenticateJWT,
  validateRequest(updateTaskSchema),
  taskController.updateTask.bind(taskController),
);

// Delete task (with authentication and validation)
router.delete(
  "/tasks",
  authenticateJWT,
  validateRequest(deleteTaskSchema),
  taskController.deleteTask.bind(taskController),
);

export default router;
