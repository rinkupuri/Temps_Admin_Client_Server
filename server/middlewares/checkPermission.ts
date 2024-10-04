import { Request, Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../types/auth.types";
import prisma from "../prisma/prismaClient";

// Middleware function
const checkPermission = (requiredPermission: string) => {
  return async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      // Assuming the user object is available in req (from a previous authentication middleware)
      const userPermissions: string[] = req.user?.Permission || [];
      if (req.user?.role === "ADMIN") return next();

      if (userPermissions.includes(requiredPermission)) {
        next(); // Permission exists, proceed to the next middleware or route handler
      } else {
        // Permission not found
        return res.status(403).json({
          message: "You don't have access to this resource",
        });
      }
    } catch (error) {
      return res.status(500).json({
        message: "Internal Server Error",
        error: error.message,
      });
    }
  };
};

export default checkPermission;
