import { CustomError } from "@/lib/customError.js";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { RequestWithUser } from "types.js";

export function verifyAuth(req: Request, res: Response, next: NextFunction) {
  // 1) Get token
  const accessToken =
    req?.cookies?.accessToken || req.headers["authorization"]?.split(" ")[1];

  console.log("✅");
  // 2) If user is not authenticated
  if (!accessToken) throw new CustomError("Unauthorized", 401);

  const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_KEY!);
  (req as RequestWithUser).user = decoded as { id: string; email: string };

  next();
}
