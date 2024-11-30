import { z } from "zod";

export const StatusEnum = z.enum(["PENDING", "IN_PROGRESS", "DONE"]);
export const PriorityEnum = z.enum(["LOW", "MEDIUM", "HIGH"]);

// Schema for creating a task
export const createTaskSchema = z.object({
  title: z.string(),
  description: z.string(),
  dueDate: z.string().datetime(),
  priority: PriorityEnum,
  status: StatusEnum,
  userId: z.string(),
});

// Schema for task response
export const taskResponseSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  dueDate: z.string().datetime(),
  priority: PriorityEnum,
  status: z.string(),
  userId: z.string(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

// Schema for getting tasks with filters
export const getTasksQuerySchema = z.object({
  search: z.string().optional(),
  page: z.string().optional(),
  limit: z.string().optional(),
  status: z.string(),
  priority: z.string(),
});

// Schema for updating a task
export const updateTaskSchema = z.object({
  taskId: z.string(),
  title: z.string().optional(),
  description: z.string().optional(),
  dueDate: z.string().datetime().optional(),
  priority: PriorityEnum.optional(),
  status: StatusEnum.optional(),
});

// Schema for deleting a task
export const deleteTaskSchema = z.object({
  taskId: z.string(),
});

// Types inferred from schemas
export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type TaskResponse = z.infer<typeof taskResponseSchema>;
export type GetTasksQuery = z.infer<typeof getTasksQuerySchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type DeleteTaskInput = z.infer<typeof deleteTaskSchema>;
