import { inject, injectable } from "inversify";
import { Task, Prisma } from "@prisma/client";
import { TYPES } from "@/types/injection";
import { CreateTaskInput } from "@/domain/schema/tasks-schema";
import {
  PrismaTaskRepository,
  TaskFilter,
} from "@/domain/repositories/task-repository";

@injectable()
export class TaskService {
  constructor(
    @inject(TYPES.ITaskRepository) private taskRepository: PrismaTaskRepository
  ) {}

  // Create a new task
  async createTask(data: CreateTaskInput): Promise<Task> {
    const task = await this.taskRepository.create(data);
    return task;
  }

  // Get tasks with pagination and filtering
  async getTasks(
    userId: string,
    filter: TaskFilter = {},
    page = 1,
    limit = 10
  ): Promise<{
    tasks: Task[];
    total: number;
    currentPage: number;
    totalPages: number;
  }> {
    const skip = (Number(page) - 1) * limit;
    const { tasks, total } = await this.taskRepository.findAll(
      userId,
      filter,
      skip,
      limit
    );

    return {
      tasks,
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    };
  }

  // Update an existing task
  async updateTask(
    taskId: string,
    data: Prisma.TaskUpdateInput,
    userId: string
  ): Promise<Task> {
    const task = await this.taskRepository.update(taskId, data);
    return task;
  }

  // Delete a task
  async deleteTask(taskId: string, userId: string): Promise<Task> {
    const task = await this.taskRepository.delete(taskId);
    return task;
  }
}
