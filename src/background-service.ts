import { logger } from "@/infrastructure/config/winston";
import { container } from "./container";
import { OverdueTaskService } from "./app/services/over-due-task-service";
import { TYPES } from "./types/injection";

export function initializeBackgroundServices() {
  try {
    // Resolve the OverdueTaskService from the container
    const overdueTaskService = container.get<OverdueTaskService>(
      TYPES.OverdueTaskService
    );

    logger.info("Background services initialized successfully");
  } catch (error) {
    logger.error("Error initializing background services:", error);
  }
}
