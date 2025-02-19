import { addToBlaclist } from "@/lib/blacklist.js";
import { CustomError } from "@/lib/customError.js";
import { getClientIP } from "@/utils/getClientIP.js";
import { NextFunction, Request, Response } from "express";
import { redis } from "@/lib/redis.js";

const MAX_PER_SECONDS = 8;
const EXPIRE_TIME = 1;

export async function rateLimiter(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const ip = getClientIP(req);

    const requests = await redis.incr(ip as string);

    if (requests === 1) {
      redis.expire(ip as string, EXPIRE_TIME);
    }

    if (requests > MAX_PER_SECONDS) {
      addToBlaclist(ip as string);
      throw new CustomError("Too many requests", 429);
    }

    next();
  } catch (err) {
    next(err);
  }
}
