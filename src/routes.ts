import express from "express";
import authRoutes from "@/infrastructure/http/auth-routes";
import taskRoutes from "@/infrastructure/http/tasks-routes";

const v1Router = express.Router();

// Mounting sub-routes under /api/v1
v1Router.use("/auth", authRoutes);
v1Router.use("/", taskRoutes);

export default v1Router;
