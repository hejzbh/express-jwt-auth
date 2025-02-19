import { addToBlaclist } from "@/lib/blacklist.js";
import { CustomError } from "@/lib/customError.js";
import { getClientIP } from "@/utils/getClientIP.js";
import { NextFunction, Request, Response } from "express";

export function rateLimiter() {
  const requests = new Map();
  const SECONDS = 1000;
  const MAX_PER_SECONDS = 8;

  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const ip = getClientIP(req);

      const now = Date.now();

      if (!requests.has(ip)) {
        requests.set(ip, { count: 1, startTime: now });
        return next();
      }

      const userData = requests.get(ip);
      const elapsedTime = now - userData.startTime;

      if (elapsedTime > SECONDS) {
        requests.delete(ip);
        return next();
      }

      if (userData.count < MAX_PER_SECONDS) {
        userData.count += 1;
        return next();
      }

      addToBlaclist(ip as string);
      throw new CustomError("Too many requests", 429);
    } catch (err) {
      next(err);
    }
  };
}
