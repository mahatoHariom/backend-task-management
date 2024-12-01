import cron from "node-cron";
import { inject, injectable } from "inversify";
import { TYPES } from "@/types/injection";
import { PrismaTaskRepository } from "@/domain/repositories/task-repository";
import { NotificationService } from "./notification-service";
import { Notification, NotificationType } from "@/types/notification";
import { logger } from "@/infrastructure/config/winston";
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
    cron.schedule("0 * * * *", async () => {
      logger.info("Starting overdue task cron job");

      try {
        const currentTime = new Date();
        logger.info(`Current time: ${currentTime.toISOString()}`);

        const overdueTasks = await this.taskRepository.findOverdue();
        logger.info(`Found ${overdueTasks.length} overdue tasks`);

        // Log details of each overdue task
        overdueTasks.forEach((task) => {
          logger.info(`Overdue Task Details:
            - Task ID: ${task.id}
            - Title: ${task.title}
            - Due Date: ${task.dueDate}
            - User ID: ${task.userId}`);
        });

        for (const task of overdueTasks) {
          const notification: Notification = {
            id: crypto.randomUUID(),
            type: NotificationType.OVERDUE,
            taskId: task.id,
            userId: task.userId,
            title: "Overdue Task",
            message: `Task "${task.title}" is overdue.`,
            timestamp: new Date(),
            isRead: false,
            dueDate: task.dueDate, // Added dueDate to notification
          };

          await this.notificationService.sendNotification(notification);
          logger.info(
            `Sent notification for overdue task "${task.title}" to user ${task.userId}`
          );
        }

        logger.info("Overdue task cron job completed successfully");
      } catch (error: any) {
        logger.error(`Error processing overdue tasks: ${error.message}`);
        logger.error(`Error stack: ${error.stack}`);
      }
    });
  }
}
