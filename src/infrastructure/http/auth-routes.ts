import express from "express";

import { container } from "@/container";
import { AuthController } from "@/app/controllers/auth-controllers";
import { TYPES } from "@/types/injection";

const router = express.Router();
const authController = container.get<AuthController>(TYPES.AuthController);

router.post("/login", authController.authenticate);
router.post("/register", authController.register);
router.post("/refresh", authController.refresh);
router.get("/profile", authController.getProfileData);

export default router;
