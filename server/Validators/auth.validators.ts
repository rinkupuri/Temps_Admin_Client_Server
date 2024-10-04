import Joi from "joi";

// Common validation schema for email and password
const email = Joi.string().email().required().messages({
  "string.base": "Email must be a string.",
  "string.empty": "Email is required.",
  "string.email": "Invalid email format.",
  "any.required": "Email is required.",
});

const password = Joi.string().min(6).required().messages({
  "string.base": "Password must be a string.",
  "string.empty": "Password is required.",
  "string.min": "Password must have at least 6 characters.",
  "any.required": "Password is required.",
});

// Login schema (only email and password are required)
export const loginSchema = Joi.object({
  email,
  password,
});

// Register schema (firstName, lastName, email, and password are required)
export const registerSchema = Joi.object({
  firstName: Joi.string().min(2).max(30).required().messages({
    "string.base": "First name must be a string.",
    "string.empty": "First name is required.",
    "string.min": "First name must have at least 2 characters.",
    "any.required": "First name is required.",
  }),
  lastName: Joi.string().min(2).max(30).required().messages({
    "string.base": "Last name must be a string.",
    "string.empty": "Last name is required.",
    "string.min": "Last name must have at least 2 characters.",
    "any.required": "Last name is required.",
  }),
  email,
  password,
});
