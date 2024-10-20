import express from "express";
import { createSheet, exportSheet } from "../controllers/sheet.controller";
import checkPermission from "../middlewares/checkPermission";
import { authMiddleware } from "../middlewares/auth.middleware";
const router = express.Router();

router.post("/export", authMiddleware, checkPermission("admin"), exportSheet);
router.post("/create", authMiddleware, checkPermission("admin"), createSheet);

export default router;


/**
 * @swagger
 * /api/v1/sheet/export:
 *   post:
 *     summary: Export product data based on uploaded CSV
 *     description: Upload a CSV file with model numbers, search the database for matching products, and generate an Excel sheet with image, MRP, and offer details. If no product is found, leave the image cell blank.
 *     tags: [Sheet]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: CSV file with Model Numbers
 *               sheetName:
 *                 type: string
 *                 example: "ProductSheet"
 *                 description: Name of the sheet to be generated
 *               brandName:
 *                 type: string
 *                 example: "Rolex"
 *                 description: Brand name to filter products
 *               locationQuery:
 *                 type: string
 *                 example: "mt,ib"
 *                 description: Stock location filter query
 *     responses:
 *       200:
 *         description: CSV export successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 link:
 *                   type: string
 *                   example: "/csv/ProductSheet.xlsx"
 *                   description: URL to download the exported Excel sheet
 *       400:
 *         description: Missing required parameters or file
 *       401:
 *         description: Unauthorized or invalid token
 *       500:
 *         description: Server error or worker failure
 */
/**
 * @swagger
 * /api/v1/sheet/create:
 *   post:
 *     summary: Create a new sheet with product data
 *     description: Create a new Excel sheet by providing product data (Model, Price, and Quantity) via a JSON payload. The sheet will include MRP and offer details, and images will be added to the relevant cells.
 *     tags: [Sheet]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: CSV file with Model Numbers
 *               sheetName:
 *                 type: string
 *                 example: "ProductSheet"
 *                 description: Name of the sheet to be generated
 *               brandName:
 *                 type: string
 *                 example: "Rolex"
 *                 description: Brand name to filter products
 *               locationQuery:
 *                 type: string
 *                 example: "mt,ib"
 *                 description: Stock location filter query
 *     responses:
 *       201:
 *         description: Sheet created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *               sheetName:
 *                 type: string
 *                 example: "NewProductSheet"
 *                 description: Name of the sheet to be created
 *               brandName:
 *                 type: string
 *                 example: "Rolex"
 *               data:
 *                 type: array
 *                 description: Array of product data
 *                 items:
 *                   type: object
 *                   properties:
 *                     model:
 *                       type: string
 *                       example: "Model123"
 *                       description: Model number of the product
 *                     price:
 *                       type: number
 *                       example: 1500.99
 *                       description: Product price
 *                     qty:
 *                       type: integer
 *                       example: 10
 *                       description: Quantity in stock
 *       400:
 *         description: Invalid request data or missing parameters
 *       401:
 *         description: Unauthorized or invalid token
 *       500:
 *         description: Internal server error
 */

