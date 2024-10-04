import { User } from "@prisma/client";
import { Request } from "express";

// Extend the Express Request interface to include the `user` property
export interface AuthenticatedRequest extends Request {
  user?: User; // This will store the verified user information
}
