import { Request, Response } from "express";
import { AsyncWrapper } from "../Error/AsyncWrapper";

export const imageUpload = AsyncWrapper(async (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "image uploaded",
  });
});
