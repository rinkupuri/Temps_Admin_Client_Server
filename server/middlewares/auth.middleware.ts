import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { User } from "@prisma/client";
import prisma from "../prisma/prismaClient"; // Import Prisma client instance
import { AsyncWrapper } from "../Error/AsyncWrapper"; // AsyncWrapper to handle errors
import { AuthenticatedRequest } from "../types/auth.types";

// Load environment variables from .env file
dotenv.config();

// Set up JWT secret (from environment variables or a default value)
const JWT_SECRET = process.env.JWT_SECRET || "defaultSecretKey";

// Middleware to verify JWT tokens
export const authMiddleware = AsyncWrapper(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    // Extract token from cookie
    const token = req.cookies.token;

    try {
      // Verify the JWT token and decode the user data
      const decoded = jwt.verify(token, JWT_SECRET) as User;

      // Find the user in the database using Prisma based on the decoded ID
      const isVerify = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          Permission: true,
        }, // Select necessary fields
      });

      // If the user does not exist or the token is invalid, return a 401 response
      if (!isVerify) {
        return res.status(401).json({ message: "Invalid token" });
      }

      // Attach the user data to the request object for future middleware or route handlers
      // @ts-ignore
      req.user = isVerify;

      // Proceed to the next middleware or route handler
      next();
    } catch (err) {
      // Catch any errors (e.g., invalid or expired token) and return a 401 response
      return res.status(401).json({ message: "Invalid or expired token" });
    }
  }
);
