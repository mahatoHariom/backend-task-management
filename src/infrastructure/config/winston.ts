import winston from "winston";

// Create a logger instance
export const logger = winston.createLogger({
  level: "info", // Default logging level
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(
      (info) => `${info.timestamp} ${info.level}: ${info.message}`
    )
  ),
  transports: [
    new winston.transports.Console(), // Log to console
    new winston.transports.File({ filename: "logs/server.log" }), // Log to a file
  ],
});

// Log unhandled exceptions and rejections
logger.exceptions.handle(
  new winston.transports.File({ filename: "logs/exceptions.log" })
);
process.on("unhandledRejection", (reason) => {
  logger.error(`Unhandled Rejection: ${reason}`);
});
