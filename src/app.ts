import "reflect-metadata";
import express, { Express } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import bodyParser from "body-parser"; // For more robust body parsing
import dotenv from "dotenv"; // For environment variable management

import { errorHandler } from "./app/middlewares/error-handler";
import v1Router from "./routes"; // Import your versioned routes
import { initializeBackgroundServices } from "./background-service";

// Load environment variables from `.env` file
dotenv.config();

export const createApp = async (): Promise<Express> => {
  const app = express();

  // Middleware for parsing JSON and URL-encoded payloads
  app.use(bodyParser.json()); // Parse application/json
  app.use(bodyParser.urlencoded({ extended: true })); // Parse application/x-www-form-urlencoded

  // Middleware for parsing cookies
  app.use(cookieParser());
  initializeBackgroundServices();

  // Enable Cross-Origin Resource Sharing (CORS)
  app.use(
    cors({
      origin: process.env.CLIENT_ENDPOINT || "*", // Replace '*' with specific origin(s) in production
      credentials: true, // Allow cookies to be sent with CORS requests
    })
  );

  // Mount versioned routes
  app.use("/api/v1", v1Router);

  // Error Handler (Always at the end of the middleware chain)
  app.use(errorHandler);

  return app;
};
