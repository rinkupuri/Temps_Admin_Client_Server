import { Request, Response } from "express";
import bcrypt from "bcrypt"; // Import bcrypt for password hashing and comparison
import { AsyncWrapper } from "../Error/AsyncWrapper"; // Custom async error handling wrapper
import prisma from "../prisma/prismaClient"; // Prisma client for database interactions
import { sendToken } from "../utils/jwt"; // Utility function to generate JWT token
import { setCookie } from "../utils/setCookie";
import { AuthenticatedRequest } from "../types/auth.types";
import Joi from "joi";
import { loginSchema, registerSchema } from "../Validators/auth.validators";

// Register User Function
export const register = AsyncWrapper(async (req: Request, res: Response) => {
  let { firstname, lastname, email, password } = req.body;

  // Validate input fields, return error if any field is missing
  if (!firstname && !lastname && !email && !password) {
    return res.status(403).json({ success: false, message: "Invalid data" });
  }

  // Validate incoming request data
  const { error } = registerSchema.validate({
    firstname,
    lastname,
    email,
    password,
  });
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details.map((detail) => detail.message).join(", "),
    });
  }

  // Hash the user's password before saving it in the database
  password = await bcrypt.hash(password, 10);

  // Check if the user already exists in the database by email
  const isExsit = await prisma.user.findUnique({ where: { email } });
  if (isExsit) {
    return res
      .status(403)
      .json({ success: false, message: "User already exists" });
  }

  // Create new user in the database with hashed password
  const user = await prisma.user.create({
    data: {
      name: `${firstname} ${lastname}`, // Combine firstName and lastName into a full name
      email,
      password,
    },
  });

  // Generate a JWT token for the authenticated user
  const token = sendToken(user);

  // Set the token in a cookie (for session management)
  setCookie(res, "token", token);

  // Respond with success and return basic user information (without the password)
  res.status(200).json({
    success: true,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  });
});

// Login User Function
export const login = AsyncWrapper(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // Validate email and password fields, return error if any field is missing
  if (!email && !password) {
    return res.status(403).json({ success: false, message: "Invalid data" });
  }

  // Validate incoming request data
  const { error } = loginSchema.validate({
    email,
    password,
  });
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details.map((detail) => detail.message).join(", "),
    });
  }

  // Retrieve user from the database based on the email
  const user = await prisma.user.findUnique({ where: { email } });

  // If user does not exist, return an error
  if (!user) {
    return res
      .status(403)
      .json({ success: false, message: "User does not exist" });
  }

  // Compare the provided password with the hashed password in the database
  const isMatch = await bcrypt.compare(password, user.password);

  // If password does not match, return an error
  if (!isMatch) {
    return res
      .status(403)
      .json({ success: false, message: "Invalid credentials" });
  }

  // Generate a JWT token for the authenticated user
  const token = sendToken(user);

  if (user.status !== "ACTIVE") {
    return res
      .status(403)
      .json({ success: false, message: "User is not active" });
  }

  // Set the token in a cookie (for session management)
  setCookie(res, "token", token);
  // Respond with success and return user data (without the password)
  res.status(200).json({
    success: true,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  });
});

// Get User Data Function
export const getUser = AsyncWrapper(
  async (req: AuthenticatedRequest, res: Response) => {
    const { user } = req;

    // Ensure the user object exists and has a valid ID
    if (!user?.id) {
      return res
        .status(403)
        .json({ success: false, message: "Invalid user data" });
    }

    // Attempt to find the user in the database
    const foundUser = await prisma.user.findUnique({ where: { id: user.id } });

    // If no user is found, return a 404 error
    if (!foundUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    delete foundUser.password;
    // Successfully found the user, return the user data
    res.status(200).json({ success: true, user: foundUser });
  }
);
