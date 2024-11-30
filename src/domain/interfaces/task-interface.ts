// import { Prisma, Task } from '@prisma/client'
// import { CreateTaskInput } from '../schema/tasks-schemas'
// import { TaskFilter } from '../repositories/task-repository'

// export interface ITaskRepository {
//   create(data: CreateTaskInput): Promise<Task>
//   findAll(userId: string, filter?: TaskFilter, skip?: number, limit?: number): Promise<{ tasks: Task[]; total: number }>
//   findById(taskId: string): Promise<Task | null>
//   update(taskId: string, data: Prisma.TaskUpdateInput): Promise<Task>
//   delete(taskId: string): Promise<Task>
//   findOverdue(): Promise<Task[]>
// }