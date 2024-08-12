import express from "express";
const router = express.Router();
import multer from "multer";
import {
  updateInventryData,
  updateMany,
} from "../controllers/inventry.controller";

const upload = multer({ dest: "uploads/" });

router.post("/updatecsv", upload.single("csvData"), updateInventryData);
router.post("/updatemany", updateMany);

export default router;
