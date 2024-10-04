import express from "express";
import {
  createMenu,
  updateMenu,
  deleteMenu,
  getUserMenus,
} from "../controllers/webData.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = express.Router();

/**
 * @route   POST /menu
 * @desc    Create a new menu with an image upload
 * @access  Private
 * @param   {file} image - The image file for the menu
 */
router.post("/menu/create", authMiddleware, createMenu);

/**
 * @route   PUT /menu/:id
 * @desc    Update an existing menu entry with an optional image upload
 * @access  Private
 * @param   {file} image - The new image file for the menu (optional)
 * @param   {string} id - The ID of the menu to update
 */
router.put("/menu/:id", authMiddleware, updateMenu);

/**
 * @route   DELETE /menu/:id
 * @desc    Delete a menu entry by ID
 * @access  Private
 * @param   {string} id - The ID of the menu to delete
 */
router.delete("/menu/:id", authMiddleware, deleteMenu);

/**
 * @route   GET /menus
 * @desc    Fetch menus accessible by the user based on their permissions
 * @access  Private
 */
router.get("/menu/get", authMiddleware, getUserMenus);

export default router;

/**
 * @swagger
 * /api/v1/webData/menu/create:
 *   post:
 *     summary: Create a new menu
 *     tags: [Menu]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               desc:
 *                 type: string
 *               link:
 *                 type: string
 *               permission:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Menu created successfully
 *       400:
 *         description: Image file is required
 */
/**
 * @swagger
 * /api/v1/webData/menu/get:
 *   get:
 *     summary: Get menus accessible by a user
 *     tags: [Menu]
 *     responses:
 *       200:
 *         description: Menus fetched successfully
 *       404:
 *         description: User not found
 */
/**
 * @swagger
 * /api/v1/webData/menu/{id}:
 *   delete:
 *     summary: Delete a menu by ID
 *     tags: [Menu]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The menu ID
 *     responses:
 *       200:
 *         description: Menu deleted successfully
 *       404:
 *         description: Menu not found
 */
/**
 * @swagger
 * /api/v1/webData/menu/{id}:
 *   put:
 *     summary: Update an existing menu
 *     tags: [Menu]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The menu ID
 *     requestBody:
 *       required: false
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               link:
 *                 type: string
 *               permission:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Menu updated successfully
 *       404:
 *         description: Menu not found
 */
