import { NextFunction, Request, Response } from "express";
import crypto from "crypto";
import { setCookie } from "../utils/setCookie";

// Middleware to check and manage the cart token in cookies
export const checkCartToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Retrieve the existing cart token from cookies
  let token = req.cookies.cartTokenTemps;

  // If the token does not exist, generate a new one
  if (!token) {
    // Generate a unique token using random bytes
    const tokenGen = crypto.randomBytes(16).toString("hex");

    // Set the generated token in cookies
    setCookie(res, "cartTokenTemps", tokenGen);
    token = tokenGen;

    // Log the generated token for debugging purposes
    console.log("Generated new token:", token);
  } else {
    // Log the found token for debugging purposes
    console.log("Token found:", token);
  }

  // Attach the cart token to the request body for further processing
  req.body.cartId = token;

  // Proceed to the next middleware or route handler
  next();
};
