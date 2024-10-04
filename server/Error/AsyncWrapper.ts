import { Request, Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../types/auth.types";

export const AsyncWrapper = (
  func: (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => Promise<any>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(func(req, res, next)).catch(next);
  };
};
