import { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { AsyncWrapper } from "../Error/AsyncWrapper"; // Wrapper to handle async errors
import prismaClient from "../prisma/prismaClient";
import { AuthenticatedRequest } from "../types/auth.types"; // Custom request type that includes user info
import { validateId } from "../utils/ValidateId";

// Utility function to handle validation errors
const handleValidationErrors = (req: Request, res: Response) => {
  const errors = validationResult(req); // Collect validation errors
  if (!errors.isEmpty()) {
    // If validation errors exist, return 400 with the errors
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }
};

// Route to get all users
export const getAllUsers = AsyncWrapper(async (req: Request, res: Response) => {
  // Fetch all users with specific fields
  const users = await prismaClient.user.findMany({
    select: { id: true, name: true, email: true, role: true, Permission: true },
  });

  // Send the response with the users list
  res.status(200).json({
    success: true,
    message: "Users fetched successfully",
    users,
  });
});

// Route to create a single user with validation
export const createUser = [
  // Validate inputs
  body("name").notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Valid email is required"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("role").notEmpty().withMessage("Role is required"),

  AsyncWrapper(async (req: Request, res: Response) => {
    // Handle validation errors
    if (handleValidationErrors(req, res)) return;

    const { name, email, password, role } = req.body;

    // Create the user in the database
    const newUser = await prismaClient.user.create({
      data: { name, email, password, role },
    });

    // Send response with the created user
    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: newUser,
    });
  }),
];

// Route to get a user by ID with validation
export const getUserById = [
  AsyncWrapper(async (req: Request, res: Response) => {
    // Handle validation errors
    if (handleValidationErrors(req, res)) return;

    const { id } = req.params;

    // Validate if id is a valid UUID
    validateId(id, res);
    // Fetch the user by ID
    const user = await prismaClient.user.findUnique({
      where: { id },
      select: { id: true, name: true, email: true, role: true },
    });

    // If the user doesn't exist, return 404
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Send the user data in the response
    res.status(200).json({
      success: true,
      message: "User fetched successfully",
      user,
    });
  }),
];

// Route to update a user by ID with validation
export const updateUser = [
  AsyncWrapper(async (req: AuthenticatedRequest, res: Response) => {
    // Handle validation errors
    if (handleValidationErrors(req, res)) return;

    const { id } = req.params;

    // Validate if id is a valid UUID
    validateId(id, res);
    const { name, password, permissions } = req.body;

    // Ensure required fields are provided
    if (!name && !password && !permissions.length) {
      return res.status(400).json({
        success: false,
        message: "All fields (name,  password) are required",
      });
    }

    // Ensure that only admins or the user themselves can update
    if (req.user.role !== "ADMIN" && req.user.id !== id) {
      return res.status(403).json({
        success: false,
        message: "You do not have access to this resource",
      });
    }

    // Update the user in the database
    const updatedUser = await prismaClient.user.update({
      where: { id },
      data: { name, password, Permission: permissions },
      select: { id: true, name: true, email: true, role: true },
    });

    // Send the updated user in the response
    res.status(200).json({
      success: true,
      message: "User updated successfully",
      user: updatedUser,
    });
  }),
];

// Route to delete a user by ID with validation
export const deleteUser = [
  AsyncWrapper(async (req: Request, res: Response) => {
    // Handle validation errors
    if (handleValidationErrors(req, res)) return;

    const { id } = req.params;

    // Validate if id is a valid UUID
    validateId(id, res);
    // Delete the user from the database
    await prismaClient.user.delete({ where: { id } });

    // Return 204 No Content on successful deletion
    res.status(204).send();
  }),
];
