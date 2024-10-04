import { Response } from "express";

export const validateId = (id: string, res: Response) => {
  // Validate if id is a valid UUID
  if (!id || !/^[0-9a-fA-F]{24}$/.test(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid user ID format",
    });
  }
};
