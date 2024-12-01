import { PrismaService } from "@/app/services/prisma-service";
import { Priority, Prisma, Status, Task } from "@prisma/client";
import { injectable } from "inversify";
import { ITaskRepository } from "../interfaces/task-interface";
import { CreateTaskInput } from "../schema/tasks-schema";

export interface TaskFilter {
  search?: string;
  status?: string;
  priority?: string;
  fromDate?: Date;
  toDate?: Date;
}
@injectable()
export class PrismaTaskRepository implements ITaskRepository {
  private readonly prisma = PrismaService.getClient();

  async create(data: CreateTaskInput): Promise<Task> {
    return this.prisma.task.create({
      data: {
        title: data.title,
        description: data.description,
        dueDate: data.dueDate,
        userId: data.userId,
        priority: data.priority,
        status: data.status,
      },
    });
  }

  /**
   * Get tasks for a user with optional search, pagination, and limit.
   */
  async findAll(
    userId: string,
    filter: TaskFilter = {},
    skip = 0,
    limit = 10
  ): Promise<{ tasks: Task[]; total: number }> {
    const safeSkip = Math.max(0, skip);
    const safeTake = Math.max(1, limit);

    const { search, status, priority, fromDate, toDate } = filter;

    const where: Prisma.TaskWhereInput = {
      userId,
      ...(search && {
        OR: [
          { title: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } },
        ],
      }),
      ...(status &&
        Object.values(Status).includes(status as Status) && {
          status: status as Status,
        }),
      ...(priority &&
        Object.values(Priority).includes(priority as Priority) && {
          priority: priority as Priority,
        }),
      ...(fromDate || toDate
        ? {
            dueDate: {
              ...(fromDate && { gte: fromDate }),
              ...(toDate && { lte: toDate }),
            },
          }
        : {}),
    };

    const [tasks, total] = await Promise.all([
      this.prisma.task.findMany({
        where,
        skip: safeSkip,
        take: safeTake,
        orderBy: { createdAt: "desc" },
        include: {
          user: true,
        },
      }),
      this.prisma.task.count({ where }),
    ]);

    return { tasks, total };
  }

  async findById(taskId: string): Promise<Task | null> {
    return this.prisma.task.findUnique({ where: { id: taskId } });
  }

  async update(taskId: string, data: Prisma.TaskUpdateInput): Promise<Task> {
    return this.prisma.task.update({
      where: { id: taskId },
      data: {
        title: data.title,
        description: data.description,
        dueDate: data.dueDate,
        priority: data.priority as Priority, // Ensure it's the correct enum
        status: data.status as Status, // Ensure it's the correct enum
      },
    });
  }

  async delete(taskId: string): Promise<Task> {
    return this.prisma.task.delete({
      where: { id: taskId },
    });
  }

  async findOverdue() {
    return this.prisma.task.findMany({
      where: {
        dueDate: {
          lt: new Date(),
        },
        status: {
          not: "DONE",
        },
      },
    });
  }
}
