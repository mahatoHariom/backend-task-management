import winston from "winston";

// Create a logger instance
export const logger = winston.createLogger({
  level: "info", // Set default logging level
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
