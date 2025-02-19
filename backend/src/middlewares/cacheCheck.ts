import { NextFunction, Request, Response } from "express";
import { CacheOptions, RequestWithUser } from "types.js";
import { redis } from "@/lib/redis.js";

export const cacheCheck = (options: CacheOptions) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const cacheKey = options.userDependent
      ? `user:${(req as RequestWithUser).user.id}:${options.key}`
      : options.key;

    const cachedData = await redis.get(cacheKey);

    if (cachedData) {
      res.status(200).json({
        data: JSON.parse(cachedData),
      });
    } else {
      next();
    }
  };
};
