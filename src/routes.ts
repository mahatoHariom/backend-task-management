import express from "express";
import authRoutes from "@/infrastructure/http/auth-routes";

const v1Router = express.Router();

// Mounting sub-routes under /api/v1
v1Router.use("/auth", authRoutes);

export default v1Router;
