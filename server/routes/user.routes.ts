// routes/user.ts

import { Router } from "express";
import {
  createUser,
  deleteUser,
  getAllUsers,
  getUserById,
  updateUser,
} from "../controllers/user.controllers";
import { authMiddleware } from "../middlewares/auth.middleware";
import checkPermission from "../middlewares/checkPermission";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: User
 *   description: API to manage users
 */

/**
 * @swagger
 * /api/v1/user/get:
 *   get:
 *     summary: Retrieve a list of users
 *     tags: [User]
 *     responses:
 *       200:
 *         description: A list of users
 */
router.get("/getall", authMiddleware, checkPermission("admin"), getAllUsers);

/**
 * @swagger
 * /api/v1/user/create:
 *   post:
 *     summary: Create a new user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: User created successfully
 */
router.post("/create", createUser);

/**
 * @swagger
 * /api/v1/user/get/{id}:
 *   get:
 *     summary: Retrieve a user by ID
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The id of the user
 *     responses:
 *       200:
 *         description: A user object
 */
router.get("/get/:id", authMiddleware, checkPermission("admin"), getUserById);

/**
 * @swagger
 * /api/v1/user/update/{id}:
 *   put:
 *     summary: Update a user by ID
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The id of the user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: User updated successfully
 */
router.put("/update/:id", authMiddleware, checkPermission("admin"), updateUser);

/**
 * @swagger
 * /api/v1/user/delete/{id}:
 *   delete:
 *     summary: Delete a user by ID
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The id of the user
 *     responses:
 *       204:
 *         description: User deleted successfully
 */
router.delete(
  "/delete/:id",
  authMiddleware,
  checkPermission("admin"),
  deleteUser
);

export default router;
