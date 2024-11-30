// import { Priority, Prisma, Status, Task } from '@prisma/client'
// import { injectable } from 'inversify'
// import { ITaskRepository } from '../interfaces/task-interface'
// import { PrismaService } from '@/app/services/prisma-service'
// import { CreateTaskInput } from '../schema/tasks-schemas'

// export interface TaskFilter {
//   search?: string
//   status?: Status
//   priority?: Priority
//   fromDate?: Date
//   toDate?: Date
// }
// @injectable()
// export class PrismaTaskRepository implements ITaskRepository {
//   private readonly prisma = PrismaService.getClient()

//   async create(data: CreateTaskInput): Promise<Task> {
//     return this.prisma.task.create({
//       data: {
//         title: data.title,
//         description: data.description,
//         dueDate: data.dueDate,
//         userId: data.userId,
//         priority: data.priority,
//         status: data.status
//       }
//     })
//   }

//   /**
//    * Get tasks for a user with optional search, pagination, and limit.
//    */

//   async findAll(
//     userId: string,
//     filter: TaskFilter = {},
//     skip = 0,
//     limit = 10
//   ): Promise<{ tasks: Task[]; total: number }> {
//     // Ensure skip is non-negative
//     const safeSkip = Math.max(0, skip)
//     // Convert limit to number and ensure it's positive
//     const safeTake = Math.max(1, Number(limit))

//     const { search, status, priority, fromDate, toDate } = filter

//     const where: Prisma.TaskWhereInput = {
//       userId,
//       ...(search && {
//         OR: [
//           { title: { contains: search, mode: 'insensitive' } },
//           { description: { contains: search, mode: 'insensitive' } }
//         ]
//       }),
//       ...(status && { status }),
//       ...(priority && { priority }),
//       ...(fromDate || toDate
//         ? {
//             dueDate: {
//               ...(fromDate && { gte: fromDate }),
//               ...(toDate && { lte: toDate })
//             }
//           }
//         : {})
//     }

//     const [tasks, total] = await Promise.all([
//       this.prisma.task.findMany({
//         where,
//         skip: safeSkip,
//         take: safeTake,
//         orderBy: { createdAt: 'desc' }
//       }),
//       this.prisma.task.count({ where })
//     ])

//     return { tasks, total }
//   }

//   async findById(taskId: string): Promise<Task | null> {
//     return this.prisma.task.findUnique({ where: { id: taskId } })
//   }

//   async update(taskId: string, data: Prisma.TaskUpdateInput): Promise<Task> {
//     return this.prisma.task.update({
//       where: { id: taskId },
//       data: {
//         title: data.title,
//         description: data.description,
//         dueDate: data.dueDate,
//         priority: data.priority as Priority, // Ensure it's the correct enum
//         status: data.status as Status // Ensure it's the correct enum
//       }
//     })
//   }

//   async delete(taskId: string): Promise<Task> {
//     return this.prisma.task.delete({
//       where: { id: taskId }
//     })
//   }

//   async findOverdue(): Promise<Task[]> {
//     const now = new Date()
//     return this.prisma.task.findMany({
//       where: {
//         dueDate: { lt: now },
//         status: 'PENDING'
//       }
//     })
//   }
// }
