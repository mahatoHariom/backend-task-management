// types/notification.ts
export enum NotificationType {
  CRUD = "CRUD",
  OVERDUE = "OVERDUE",
}

export enum CRUDAction {
  CREATE = "CREATE",
  UPDATE = "UPDATE",
  DELETE = "DELETE",
}

export interface Notification {
  id: string;
  type: NotificationType;
  action?: CRUDAction;
  taskId: string;
  userId: string;
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  dueDate?: string | Date;
}
