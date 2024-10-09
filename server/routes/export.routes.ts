import express from "express";
import { exportSheet } from "../controllers/sheet.controller";
import checkPermission from "../middlewares/checkPermission";
import { authMiddleware } from "../middlewares/auth.middleware";
const router = express.Router();

router.post("/export", authMiddleware, checkPermission("admin"), exportSheet);

export default router;
