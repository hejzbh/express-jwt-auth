import { NextFunction, Request, Response } from "express";
import { CustomError } from "@/lib/customError.js";

export function errorHandler(
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  res.status(err.status || 500).json({
    error: err.message,
    success: false,
  });
}
