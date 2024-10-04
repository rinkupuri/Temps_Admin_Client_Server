import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { User } from "@prisma/client";

dotenv.config(); // Load environment variables from .env file

const JWT_SECRET = process.env.JWT_SECRET || "defaultSecretKey"; // Fallback if no env var

export const sendToken = (user: User): string => {
  // Token payload
  const payload = {
    id: user.id,
    username: user.name,
    email: user.email,
    role: user.role,
  };

  // Options like token expiration
  const options = {
    expiresIn: "7d", // Token expires in 1 hour
  };

  // Generate token
  const token = jwt.sign(payload, JWT_SECRET, options);
  return token;
};
