import express from "express";
import { checkCartToken } from "../middlewares/cart.middleware";
import { addToCart, getCart } from "../controllers/cart.controllers";
import { authMiddleware } from "../middlewares/auth.middleware";
const router = express.Router();

/**
 * @route   POST /addItem
 * @desc    Add an item to the cart
 * @access  Private
 */
router.post("/addItem", authMiddleware, checkCartToken, addToCart);

/**
 * @route   GET /get
 * @desc    Get cart details by cartId
 * @access  Private
 */
router.get("/get", authMiddleware, checkCartToken, getCart);

export default router;



/**
 * @swagger
 * components:
 *   schemas:
 *     CartItem:
 *       type: object
 *       properties:
 *         cartId:
 *           type: string
 *           description: The unique identifier for the cart.
 *         model:
 *           type: string
 *           description: The model name of the product.
 *         quantity:
 *           type: integer
 *           description: The quantity of the product.
 *     CartResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           description: Indicates if the operation was successful.
 *         cart:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               model:
 *                 type: string
 *               quantity:
 *                 type: integer
 *               product:
 *                 type: object
 *                 properties:
 *                   modelName:
 *                     type: string
 *                   mrp:
 *                     type: number
 *                   image:
 *                     type: string
 *                   brand:
 *                     type: string
 *                   stockId:
 *                     type: object
 *                     properties:
 *                       ddnStock:
 *                         type: integer
 *                       dlStock:
 *                         type: integer
 *                       ibStock:
 *                         type: integer
 *                       godwanStock:
 *                         type: integer
 *                       mainStock:
 *                         type: integer
 *                       mtStock:
 *                         type: integer
 *                       smapleLine:
 *                         type: integer
 */

/**
 * @swagger
 * /api/v1/cart/addItem:
 *   post:
 *     summary: Add an item to the cart.
 *     tags: [Cart]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cartId:
 *                 type: string
 *                 description: The unique identifier for the cart.
 *               model:
 *                 type: string
 *                 description: The model name of the product.
 *               quantity:
 *                 type: integer
 *                 description: The quantity of the product.
 *     responses:
 *       200:
 *         description: The cart item was successfully updated.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CartResponse'
 *       201:
 *         description: The cart item was successfully added.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CartResponse'
 *       400:
 *         description: Invalid cart quantity.
 */

/**
 * @swagger
 * /api/v1/cart/get:
 *   get:
 *     summary: Fetch the cart items.
 *     tags: [Cart]
 *     responses:
 *       200:
 *         description: The cart details were fetched successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CartResponse'
 *       404:
 *         description: Cart not found.
 */

