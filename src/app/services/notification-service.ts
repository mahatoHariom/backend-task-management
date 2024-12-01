import { Notification } from "@/types/notification";
import { IncomingMessage } from "http"; // Import the IncomingMessage type from Node.js' http module
import { injectable } from "inversify";
import WebSocket from "ws";

import { logger } from "@/infrastructure/config/winston";
// import { IncomingMessage } from "http";

// @injectable()
// export class NotificationService {
//   private wsServer: WebSocket.Server;
//   private clients: Map<string, WebSocket[]> = new Map();

//   constructor() {
//     this.wsServer = new WebSocket.Server({
//       port: process.env.WEBSOCKET_PORT
//         ? parseInt(process.env.WEBSOCKET_PORT)
//         : 8080,
//     });
//     this.setupWebSocketServer();
//   }

//   private setupWebSocketServer() {
//     this.wsServer.on("connection", (ws, req: IncomingMessage) => {
//       const userId = this.extractUserIdFromRequest(req) ?? "unknown";

//       console.log(`WebSocket connection established for user: ${userId}`);

//       if (userId !== "unknown") {
//         if (!this.clients.has(userId)) {
//           this.clients.set(userId, []);
//         }
//         this.clients.get(userId)?.push(ws);

//         ws.on("close", () => {
//           console.log(`WebSocket connection closed for user: ${userId}`);
//           const userWs = this.clients.get(userId);
//           if (userWs) {
//             this.clients.set(
//               userId,
//               userWs.filter((client) => client !== ws)
//             );
//           }
//         });

//         ws.on("error", (error) => {
//           console.error(`WebSocket error for user ${userId}:`, error);
//         });
//       }
//     });
//   }

//   private extractUserIdFromRequest(req: IncomingMessage): string | null {
//     const url = new URL(req.url || "", `http://localhost`);
//     return url.searchParams.get("userId");
//   }

//   async sendNotification(notification: Notification) {
//     const userClients = this.clients.get(notification.userId);

//     if (userClients) {
//       const savedNotification = await this.saveNotification(notification);

//       userClients.forEach((client) => {
//         if (client.readyState === WebSocket.OPEN) {
//           client.send(JSON.stringify(savedNotification));
//         }
//       });
//     }
//   }

//   private async saveNotification(
//     notification: Notification
//   ): Promise<Notification> {
//     return {
//       ...notification,
//       id: crypto.randomUUID(),
//       isRead: false,
//     };
//   }
// }

@injectable()
export class NotificationService {
  private wsServer: WebSocket.Server;
  private clients: Map<string, WebSocket[]> = new Map();

  constructor() {
    this.wsServer = new WebSocket.Server({
      port: process.env.WEBSOCKET_PORT
        ? parseInt(process.env.WEBSOCKET_PORT)
        : 8080,
    });
    this.setupWebSocketServer();
  }

  private setupWebSocketServer() {
    this.wsServer.on("connection", (ws, req: IncomingMessage) => {
      const userId = this.extractUserIdFromRequest(req) ?? "unknown";
      logger.info(`WebSocket connection established for user: ${userId}`);

      if (userId !== "unknown") {
        if (!this.clients.has(userId)) {
          this.clients.set(userId, []);
        }
        this.clients.get(userId)?.push(ws);

        ws.on("message", (message) => {
          logger.info(`Message received from user ${userId}: ${message}`);
        });

        ws.on("close", () => {
          logger.info(`WebSocket connection closed for user: ${userId}`);
          const userWs = this.clients.get(userId);
          if (userWs) {
            this.clients.set(
              userId,
              userWs.filter((client) => client !== ws)
            );
          }
        });

        ws.on("error", (error) => {
          logger.error(`WebSocket error for user ${userId}: ${error.message}`);
        });
      }
    });
  }

  private extractUserIdFromRequest(req: IncomingMessage): string | null {
    const url = new URL(req.url || "", `http://localhost`);
    return url.searchParams.get("userId");
  }

  async sendNotification(notification: Notification) {
    const userClients = this.clients.get(notification.userId);

    if (userClients) {
      const savedNotification = await this.saveNotification(notification);
      logger.info(
        `Notification saved and being sent to user ${notification.userId}: ${notification.title}`
      );

      userClients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(savedNotification));
        }
      });
    } else {
      logger.warn(
        `No active WebSocket connections for user ${notification.userId}`
      );
    }
  }

  private async saveNotification(
    notification: Notification
  ): Promise<Notification> {
    const savedNotification = {
      ...notification,
      id: crypto.randomUUID(),
      isRead: false,
    };
    logger.info(
      `Notification saved to database: ${JSON.stringify(savedNotification)}`
    );
    return savedNotification;
  }
}
