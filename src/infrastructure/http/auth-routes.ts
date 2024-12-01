import express from "express";

import { container } from "@/container";
import { AuthController } from "@/app/controllers/auth-controllers";
import { TYPES } from "@/types/injection";

const router = express.Router();
const authController = container.get<AuthController>(TYPES.AuthController);

router.post("/login", authController.authenticate.bind(authController));
router.post("/register", authController.register.bind(authController));
router.post("/refresh", authController.refresh.bind(authController));
// router.get("/profile", authController.getProfileData.bind(authController));

export default router;
