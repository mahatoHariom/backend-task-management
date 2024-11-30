import cron from "node-cron";
import { inject, injectable } from "inversify";
import { TYPES } from "@/types/injection";
import { PrismaTaskRepository } from "@/domain/repositories/task-repository";
import { NotificationService } from "./notification-service";
import { Notification, NotificationType } from "@/types/notification";

@injectable()
export class OverdueTaskService {
  constructor(
    @inject(TYPES.ITaskRepository)
    private taskRepository: PrismaTaskRepository,
    @inject(TYPES.NotificationService)
    private notificationService: NotificationService
  ) {
    this.setupOverdueTaskCronJob();
  }

  private setupOverdueTaskCronJob() {
    // Run every day at midnight
    cron.schedule("0 0 * * *", async () => {
      try {
        const overdueTasks = await this.taskRepository.findOverdue();

        for (const task of overdueTasks) {
          // Ensure all properties are provided
          const notification: Notification = {
            id: crypto.randomUUID(), // Generate a unique ID for the notification
            type: NotificationType.OVERDUE,
            taskId: task.id,
            userId: task.userId,
            title: "Overdue Task",
            message: `Task "${task.title}" is overdue`,
            timestamp: new Date(),
            isRead: false, // Default value for `isRead`
          };

          await this.notificationService.sendNotification(notification);
        }
      } catch (error) {
        console.error("Error processing overdue tasks:", error);
      }
    });
  }
}
