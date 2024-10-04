import express from "express";
import {
  allProductExport,
  createProduct,
  createProductCSV,
  getBrands,
  getProducts,
  searchProduct,
  updateOffer,
} from "../controllers/products.controller";
import multer from "multer";
import { authMiddleware } from "../middlewares/auth.middleware";
import checkPermission from "../middlewares/checkPermission";

const router = express.Router();

// Configure multer for file uploads, setting the destination folder to 'uploads/'
const upload = multer({ dest: "uploads/" });

/**
 * @route   POST /create
 * @desc    Create a new product
 * @access  Public
 */
router.post("/create", authMiddleware,checkPermission('admin') ,createProduct);

/**
 * @route   POST /createcsv
 * @desc    Create products by uploading a CSV file
 * @access  Public
 * @param   {file} csvData - The CSV file containing product data
 */
router.post("/createcsv", authMiddleware,checkPermission('admin'), upload.single("csvData"), createProductCSV);

/**
 * @route   GET /get
 * @desc    Get a list of all products
 * @access  Public
 */
router.get("/get", authMiddleware,checkPermission('products'), getProducts);

/**
 * @route   GET /search
 * @desc    Search for a product by query parameters
 * @access  Public
 */
router.get("/search", authMiddleware,checkPermission('search'), searchProduct);

/**
 * @route   GET /brand
 * @desc    Get a list of product brands
 * @access  Public
 */
router.get("/brand",authMiddleware, checkPermission("products"), getBrands);

/**
 * @route   GET /exportall
 * @desc    Export all product data
 * @access  Public
 */
router.get("/exportall",authMiddleware , checkPermission('admin'), allProductExport);

/**
 * @route   POST /offerupdate
 * @desc    Update product offers by uploading a CSV file
 * @access  Public
 * @param   {file} csvData - The CSV file containing offer updates
 */
router.post("/offerupdate",authMiddleware, upload.single("csvData"), updateOffer);



/**
 * @swagger
 * tags:
 *   name: Products
 *   description: API to manage products
 */

/**
 * @swagger
 * /api/v1/product/create:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               modelName:
 *                 type: string
 *               image:
 *                 type: string
 *               mrp:
 *                 type: number
 *               brand:
 *                 type: string
 *     responses:
 *       200:
 *         description: Product created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 product:
 *                   type: object
 *       403:
 *         description: Invalid data
 */

/**
 * @swagger
 * /api/v1/product/createcsv:
 *   post:
 *     summary: Create products by uploading a CSV file
 *     tags: [Products]
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
 *         description: Products created successfully
 *       500:
 *         description: Error processing CSV
 */

/**
 * @swagger
 * /api/v1/product/get:
 *   get:
 *     summary: Get a list of all products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: A list of products
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 products:
 *                   type: array
 *                   items:
 *                     type: object
 */

/**
 * @swagger
 * /api/v1/product/search:
 *   get:
 *     summary: Search for a product
 *     tags: [Products]
 *     parameters:
 *       - name: query
 *         in: query
 *         required: true
 *         description: Search query
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of products matching the search query
 */

/**
 * @swagger
 * /api/v1/product/brand:
 *   get:
 *     summary: Get a list of product brands
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: A list of brands
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 brands:
 *                   type: array
 *                   items:
 *                     type: string
 */

/**
 * @swagger
 * /api/v1/product/exportall:
 *   get:
 *     summary: Export all product data
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Products exported successfully
 */

/**
 * @swagger
 * /api/v1/product/offerupdate:
 *   post:
 *     summary: Update product offers by uploading a CSV file
 *     tags: [Products]
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
 *         description: Offers updated successfully
 *       500:
 *         description: Error processing CSV
 */


export default router;
