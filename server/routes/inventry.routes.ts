import express from "express";
const router = express.Router();
import multer from "multer";
import { updateInventryData } from "../controllers/inventry.controller";

const upload = multer({ dest: "uploads/" });

router.post("/updatecsv", upload.single("csvData"), updateInventryData);

export default router;
