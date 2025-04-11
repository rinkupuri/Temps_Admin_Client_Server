import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import checkPermission from "../middlewares/checkPermission";
const router = express.Router();

router.post("/create",authMiddleware,checkPermission("admin"), )


export default router;