import { Response } from "express";

export const setCookie = (res: Response, tokenName: string, token: string) => {
  const isProduction = process.env.NODE_ENV === "production";

  // Set cookie options based on environment
  const cookieOptions: {
    httpOnly: boolean;
    secure: boolean;
    sameSite: "strict" | "lax" | "none"; // Explicitly typing the sameSite values
    maxAge: number;
  } = {
    httpOnly: true, // Prevents client-side scripts from accessing the cookie
    secure: isProduction, // Ensures cookie is sent over HTTPS in production
    sameSite: isProduction ? "strict" : "lax", // Prevents CSRF in production, relaxed in development
    maxAge: 24 * 60 * 60 * 1000, // 1 day (in milliseconds)
  };

  // Set the cookie with the JWT token and options
  res.cookie(tokenName, token, cookieOptions);
};
