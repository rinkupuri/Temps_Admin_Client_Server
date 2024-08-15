import express from "express";
const router = express.Router();
import multer from "multer";
import {
  exportModelWiseStock,
  updateInventryData,
  updateMany,
} from "../controllers/inventry.controller";

const upload = multer({ dest: "uploads/" });

router.post("/updatecsv", upload.single("csvData"), updateInventryData);
router.post("/updatemany", updateMany);
router.post("/exportmodelwise", exportModelWiseStock);

export default router;
