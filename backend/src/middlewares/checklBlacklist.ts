import { isBlacklisted } from "@/lib/blacklist.js";
import { CustomError } from "@/lib/customError.js";
import { getClientIP } from "@/utils/getClientIP.js";
import { NextFunction, Request, Response } from "express";

export async function checkBlacklist(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const ip = getClientIP(req);

  if (ip && (await isBlacklisted(ip))) {
    return next(new CustomError("Your IP is banned!", 403));
  }

  next();
}
