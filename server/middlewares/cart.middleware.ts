import { NextFunction, Request, Response } from "express";
import crypto from "crypto";

export const checkCartToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let token = req.cookies.cartTokenTemps;
  if (!token) {
    // Generate a unique token
    const tokenGen = crypto.randomBytes(16).toString("hex");

    // Set the token in the cookies
    res.cookie("cartTokenTemps", tokenGen, {
      // httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Set to true in production
      sameSite: "none",
    });
    token = tokenGen;

    console.log("Generated new token:", token);
  } else {
    console.log("Token found:", req.cookies.cartTokenTemps);
  }
  req.body.cartId = token;
  next();
};
