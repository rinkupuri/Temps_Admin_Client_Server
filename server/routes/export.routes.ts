import express from "express";
import { exportSheet } from "../controllers/sheet.controller";
const router = express.Router();

router.post("/export", exportSheet);

export default router;
