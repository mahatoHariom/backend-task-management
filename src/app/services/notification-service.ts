import { Notification } from "@/types/notification";
import { IncomingMessage } from "http"; // Import the IncomingMessage type from Node.js' http module
import { injectable } from "inversify";
import WebSocket from "ws";

@injectable()
export class NotificationService {
  private wsServer: WebSocket.Server;
  private clients: Map<string, WebSocket[]> = new Map();

  constructor() {
    // Initialize WebSocket server
    this.wsServer = new WebSocket.Server({
      port: process.env.WEBSOCKET_PORT
        ? parseInt(process.env.WEBSOCKET_PORT)
        : 8080,
    });
    this.setupWebSocketServer();
  }

  private setupWebSocketServer() {
    this.wsServer.on("connection", (ws, req: IncomingMessage) => {
      // Use IncomingMessage type here
      // Extract user ID from connection request
      //   const userId = this.extractUserIdFromRequest(req) ?? "1";
      const userId = "cm44c2mhw0000jlrz6ma5yob9";

      if (userId) {
        if (!this.clients.has(userId)) {
          this.clients.set(userId, []);
        }
        this.clients.get(userId)?.push(ws);

        ws.on("close", () => {
          const userWs = this.clients.get(userId);
          if (userWs) {
            this.clients.set(
              userId,
              userWs.filter((client) => client !== ws)
            );
          }
        });
      }
    });
  }

  private extractUserIdFromRequest(req: IncomingMessage): string | null {
    // Extract userId from the query parameters (this is just an example)
    const url = new URL(req.url || "", `http://localhost`);
    return url.searchParams.get("userId");
  }

  // Send notification to specific user
  async sendNotification(notification: Notification) {
    const userClients = this.clients.get(notification.userId);

    if (userClients) {
      // Persist notification to database
      const savedNotification = await this.saveNotification(notification);

      userClients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(savedNotification));
        }
      });
    }
  }

  // Save notification to database
  private async saveNotification(
    notification: Notification
  ): Promise<Notification> {
    // Simulating the database persistence
    return {
      ...notification,
      id: crypto.randomUUID(),
      isRead: false,
    };
  }
}
