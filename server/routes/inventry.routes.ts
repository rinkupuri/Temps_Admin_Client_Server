import express from "express";
const router = express.Router();
import multer from "multer";
import {
  exportModelWiseStock,
  updateInventryData,
  updateMany,
} from "../controllers/inventry.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const upload = multer({ dest: "uploads/" });

// routes/inventory.js

/**
 * @route   POST /updatecsv
 * @desc    Update inventory data by uploading a CSV file
 * @access  Private
 * @param   {file} csvData - The CSV file containing inventory data
 */
router.post(
  "/updatecsv",
  authMiddleware,
  upload.single("csvData"),
  updateInventryData
);

/**
 * @route   POST /updatemany
 * @desc    Update multiple inventory items at once
 * @access  Private
 */
router.post("/updatemany", authMiddleware, updateMany);

/**
 * @route   POST /exportmodelwise
 * @desc    Export inventory data model-wise
 * @access  Private
 */
router.post("/exportmodelwise", authMiddleware, exportModelWiseStock);


export default router;

/**
 * @swagger
 * /api/v1/inventry/updatemany:
 *   post:
 *     summary: Update many product stocks to 0
 *     tags: [Inventory]
 *     responses:
 *       200:
 *         description: Successfully updated all stocks to 0
 *       500:
 *         description: Error occurred while processing
 */

/**
 * @swagger
 * /api/v1/inventry/exportmodelwise:
 *   post:
 *     summary: Export stock model-wise
 *     tags: [Inventory]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               modelString:
 *                 type: string
 *                 description: String of model numbers to export
 *     responses:
 *       200:
 *         description: Successfully exported model-wise stock
 *       500:
 *         description: Error occurred while processing
 */

/**
 * @swagger
 * /api/v1/inventry/updatecsv:
 *   post:
 *     summary: Update inventory data using CSV file
 *     tags: [Inventory]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               csvData:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Successfully updated inventory
 *       500:
 *         description: Error occurred while processing
 */